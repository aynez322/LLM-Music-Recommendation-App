import asyncio

import diskcache
import httpx
import numpy as np
import pytest

from api import http, recommender, results
from api.models import RecommendRequest, Track


def track(i: int, title: str, artist: str) -> Track:
    return Track(deezer_id=i, title=title, artist=artist, artist_id=i, rank=500_000)


SEED = track(1, "Reckoner", "Radiohead")
SONGS = [track(10 + i, f"Song {i}", f"Artist {i}") for i in range(5)]


# ── unreachable hosts ─────────────────────────────────────────────────

def test_unreachable_host_is_skipped_for_a_while(monkeypatch):
    calls = []

    async def refuse(self, url, **kwargs):
        calls.append(url)
        raise httpx.ConnectTimeout("no route")

    monkeypatch.setattr(httpx.AsyncClient, "get", refuse)
    monkeypatch.setattr(http, "_down_until", {})

    async def go():
        misses = http.track_misses()
        first = await http.get_json("https://down.example/a")
        second = await http.get_json("https://down.example/b")
        other = await http.get_json("https://other.example/c")
        await http.close()
        return misses, first, second, other

    misses, first, second, other = asyncio.run(go())
    assert first is None and second is None and other is None
    # the second call to the same host doesn't wait for another timeout
    assert calls == ["https://down.example/a", "https://other.example/c"]
    assert misses == ["down.example", "down.example", "other.example"]


# ── results cache ─────────────────────────────────────────────────────

@pytest.fixture
def pipeline(monkeypatch, tmp_path):
    """The recommender with its sources faked; counts how often each runs."""
    monkeypatch.setattr(results, "cache", diskcache.Cache(str(tmp_path / "results")))
    runs = {"candidates": 0, "embed": 0}

    async def resolve(req):
        return SEED

    async def from_similar_tracks(seed):
        runs["candidates"] += 1
        return [recommender.Candidate(t, listener=0.9 - i * 0.1, via=["Last.fm listeners of “Reckoner” also play this"],
                                      from_similar_track=True) for i, t in enumerate(SONGS)]

    async def nothing(seed):
        return []

    rng = np.random.default_rng(0)
    vectors = {t.deezer_id: v / np.linalg.norm(v) for t, v in
               ((t, rng.normal(size=8)) for t in [SEED, *SONGS])}

    async def embed(tracks):
        runs["embed"] += 1
        return {t.deezer_id: vectors[t.deezer_id] for t in tracks} if runs.get("audio", True) else {}

    async def no_tags(seed, picked):
        return {}

    monkeypatch.setattr(recommender, "_resolve_seed", resolve)
    monkeypatch.setattr(recommender, "_from_similar_tracks", from_similar_tracks)
    monkeypatch.setattr(recommender, "_from_similar_artists", nothing)
    monkeypatch.setattr(recommender, "_from_seed_artist", nothing)
    monkeypatch.setattr(recommender.audio, "embed", embed)
    monkeypatch.setattr(recommender, "_tag_reasons", no_tags)
    return runs


def search(discovery: float = 0.5) -> list[dict]:
    async def go():
        return [e async for e in recommender.recommend(RecommendRequest(deezer_id=1, discovery=discovery))]
    return asyncio.run(go())


def test_repeat_search_is_replayed_from_cache(pipeline):
    first = search()
    second = search()
    assert second == first
    assert pipeline == {"candidates": 1, "embed": 1}
    assert [e["type"] for e in second][-2:] == ["results", "done"]


def test_other_discovery_reuses_the_candidates(pipeline):
    search(0.5)
    search(0.9)
    assert pipeline["candidates"] == 1   # gathered once
    assert pipeline["embed"] == 2        # ranked again (audio has its own cache)


def test_search_without_audio_is_not_kept(pipeline):
    pipeline["audio"] = False
    search()
    search()
    assert pipeline["embed"] == 2


# ── trending pre-warm ─────────────────────────────────────────────────

def test_prewarm_waits_for_real_searches_and_skips_cached(monkeypatch, tmp_path):
    from api import prewarm

    monkeypatch.setattr(results, "cache", diskcache.Cache(str(tmp_path / "results")))
    monkeypatch.setattr(prewarm, "SONG_GAP", 0)
    chart = [SEED, *SONGS[:2]]
    results.put_result(SONGS[0].deezer_id, 0.5, 10, [{"type": "done"}], degraded=False)  # already warm
    warmed = []

    async def fake_chart(limit):
        return chart

    async def fake_warm(track_id):
        warmed.append((track_id, prewarm._active))
        results.put_result(track_id, 0.5, 10, [{"type": "done"}], degraded=False)

    monkeypatch.setattr(prewarm.deezer, "chart", fake_chart)
    monkeypatch.setattr(prewarm, "_warm", fake_warm)

    async def go():
        with prewarm.user_search():                      # a real search is running...
            task = asyncio.create_task(prewarm.one_pass())
            await asyncio.sleep(0.3)
            assert warmed == []                          # ...so nothing is pre-warmed yet
        await task                                       # search over: it carries on

    asyncio.run(go())
    # only the songs that weren't cached, and never while a search ran
    assert warmed == [(SEED.deezer_id, 0), (SONGS[1].deezer_id, 0)]
    assert prewarm.status["cached"] == 3 and prewarm.status["total"] == 3
