"""Shared async HTTP client with an on-disk response cache and per-host rate limiting."""
import asyncio
import json
import logging
import os
import time
from collections import deque
from contextvars import ContextVar
from urllib.parse import urlsplit

import diskcache
import httpx

CACHE_DIR = os.getenv("CACHE_DIR", os.path.join(os.path.dirname(__file__), "..", ".cache"))
cache = diskcache.Cache(os.path.join(CACHE_DIR, "http"), size_limit=512 * 1024**2)

_client: httpx.AsyncClient | None = None
log = logging.getLogger(__name__)

# A host that can't be reached (connection refused, timed out) is skipped for a
# while: otherwise every call waits out its own timeout, and since failures
# aren't cached, every repeat search pays that wait again.
HOST_COOLDOWN = 120
_down_until: dict[str, float] = {}

# Requests that failed during the current search, so its result can be kept
# for a shorter time (it was built without that source). Set per search with
# track_misses(); tasks started inside it share the same list.
_misses: ContextVar[list[str] | None] = ContextVar("http_misses", default=None)


def track_misses() -> list[str]:
    """Start recording failed requests for the current task; returns the list."""
    misses: list[str] = []
    _misses.set(misses)
    return misses


def _missed(host: str) -> None:
    misses = _misses.get()
    if misses is not None:
        misses.append(host)


def client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(
            timeout=httpx.Timeout(10.0, connect=5.0),
            headers={"User-Agent": "LLMusic/2.0 (https://github.com/aynez322/LLMusic)"},
            follow_redirects=True,
        )
    return _client


async def close() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


class RateLimiter:
    """Allows at most `calls` requests per `period` seconds (sliding window)."""

    def __init__(self, calls: int, period: float):
        self.calls, self.period = calls, period
        self._stamps: deque[float] = deque()
        self._lock = asyncio.Lock()

    async def wait(self) -> None:
        async with self._lock:
            while True:
                now = time.monotonic()
                while self._stamps and now - self._stamps[0] > self.period:
                    self._stamps.popleft()
                if len(self._stamps) < self.calls:
                    self._stamps.append(now)
                    return
                await asyncio.sleep(self.period - (now - self._stamps[0]) + 0.01)


async def get_json(
    url: str,
    params: dict | None = None,
    *,
    limiter: RateLimiter | None = None,
    ttl: int = 7 * 24 * 3600,
    cache_params: dict | None = None,
) -> dict | list | None:
    """GET a JSON resource, served from cache when fresh. Returns None on any failure.

    `cache_params` replaces `params` in the cache key, so secrets like API keys
    never end up in the cache file.
    """
    key = "GET " + url + "?" + json.dumps(cache_params if cache_params is not None else params, sort_keys=True)
    hit = cache.get(key)
    if hit is not None:
        return hit

    host = urlsplit(url).hostname or ""
    if _down_until.get(host, 0) > time.monotonic():
        _missed(host)
        return None

    if limiter:
        await limiter.wait()
    try:
        resp = await client().get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
    except httpx.TransportError as e:   # unreachable: skip the host for a while
        if _down_until.get(host, 0) <= time.monotonic():
            log.warning("%s unreachable (%s), skipping it for %ds", host, type(e).__name__, HOST_COOLDOWN)
        _down_until[host] = time.monotonic() + HOST_COOLDOWN
        _missed(host)
        return None
    except httpx.HTTPStatusError as e:
        # 404 and the like are real answers ("not found"); only an overloaded or
        # broken service means the result is missing something
        if e.response.status_code >= 500 or e.response.status_code == 429:
            _missed(host)
        return None
    except (httpx.HTTPError, ValueError):
        _missed(host)
        return None

    cache.set(key, data, expire=ttl)
    return data


async def get_bytes(url: str, *, limiter: RateLimiter | None = None) -> bytes | None:
    if limiter:
        await limiter.wait()
    try:
        resp = await client().get(url)
        resp.raise_for_status()
        return resp.content
    except httpx.HTTPError:
        return None
