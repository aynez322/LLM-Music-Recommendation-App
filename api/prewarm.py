"""Pre-warm the trending songs, so finding songs similar to one is instant.

A background task works through the home page's chart one song at a time,
running each through the recommender at the default settings, which fills the
results cache. Real searches come first: the task waits while any is running,
and between songs. Songs already cached are skipped, so a pass over a warm
cache costs only lookups; passes repeat, picking up chart changes and redoing
results that expired (or were built while a source was down).
"""
import asyncio
import logging
import os
import time
from contextlib import contextmanager

from api import results
from api.models import RecommendRequest
from api.recommender import recommend
from api.sources import deezer

log = logging.getLogger(__name__)

# what the home page asks for and searches with by default
CHART_SIZE = 20
DEFAULT = RecommendRequest()

START_DELAY = 15          # let the server and the audio model start first
PASS_INTERVAL = 30 * 60   # how often to look at the chart again
SONG_GAP = 2              # breathing room between two songs

_active = 0               # real searches running right now
status = {"cached": 0, "total": 0, "last_pass": None, "running": False}


def enabled() -> bool:
    return os.getenv("PREWARM_TRENDING", "1") != "0"


@contextmanager
def user_search():
    """Mark a real search as running; the pre-warm waits until none are."""
    global _active
    _active += 1
    try:
        yield
    finally:
        _active -= 1


async def _wait_for_quiet() -> None:
    while _active:
        await asyncio.sleep(1)


async def _warm(track_id: int) -> None:
    req = DEFAULT.model_copy(update={"deezer_id": track_id})
    async for _ in recommend(req):
        pass


def _is_cached(track_id: int) -> bool:
    return results.has_result(track_id, DEFAULT.discovery, DEFAULT.limit)


async def one_pass() -> None:
    tracks = await deezer.chart(limit=CHART_SIZE)
    status["total"] = len(tracks)
    status["running"] = True
    try:
        for t in tracks:
            if _is_cached(t.deezer_id):
                continue
            await _wait_for_quiet()
            started = time.monotonic()
            try:
                await _warm(t.deezer_id)
                log.info("pre-warmed %s - %s in %.1fs", t.title, t.artist, time.monotonic() - started)
            except Exception:
                log.exception("pre-warm failed for %s", t.deezer_id)
            await asyncio.sleep(SONG_GAP)
    finally:
        status["running"] = False
        status["cached"] = sum(_is_cached(t.deezer_id) for t in tracks)
        status["last_pass"] = time.strftime("%Y-%m-%d %H:%M:%S")


async def run_forever() -> None:
    await asyncio.sleep(START_DELAY)
    while True:
        try:
            await one_pass()
        except Exception:
            log.exception("pre-warm pass failed")
        await asyncio.sleep(PASS_INTERVAL)
