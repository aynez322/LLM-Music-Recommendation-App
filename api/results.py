"""Finished searches, so asking again is instant.

Two levels, both keyed by the seed's Deezer id:

* results: everything a search sent after the seed (steps + the ranked list),
  per Discovery value and list length; replayed as-is on a repeat.
* candidates: the songs gathered from listener data. That part doesn't depend
  on Discovery and is most of the network work, so moving the slider on a song
  that was searched before skips it. (Audio embeddings have their own cache in
  audio.py.)

A search built while a source was unreachable is missing part of its evidence,
so it's kept briefly and redone once the source may be back.
"""
import os

import diskcache

from api.http import CACHE_DIR

cache = diskcache.Cache(os.path.join(CACHE_DIR, "results"), size_limit=128 * 1024**2)

TTL = 24 * 3600           # listener data and charts move slowly
DEGRADED_TTL = 3600       # built without a source: try again within the hour


def ttl(degraded: bool) -> int:
    return DEGRADED_TTL if degraded else TTL


def _result_key(seed_id: int, discovery: float, limit: int) -> str:
    return f"result:{seed_id}:{discovery:.2f}:{limit}"


def get_result(seed_id: int, discovery: float, limit: int) -> list[dict] | None:
    return cache.get(_result_key(seed_id, discovery, limit))


def has_result(seed_id: int, discovery: float, limit: int) -> bool:
    return _result_key(seed_id, discovery, limit) in cache


def put_result(seed_id: int, discovery: float, limit: int, events: list[dict], degraded: bool) -> None:
    cache.set(_result_key(seed_id, discovery, limit), events, expire=ttl(degraded))


def get_candidates(seed_id: int):
    return cache.get(f"candidates:{seed_id}")


def put_candidates(seed_id: int, cands: list, degraded: bool) -> None:
    cache.set(f"candidates:{seed_id}", cands, expire=ttl(degraded))
