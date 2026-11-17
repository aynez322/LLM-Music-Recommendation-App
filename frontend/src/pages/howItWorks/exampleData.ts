// Real data for the How it works illustrations, saved from actual searches
// (2026-11-17), so the page shows what the app really does. Nothing here is
// fetched at runtime except the cover images (and a preview, if played).
import type { Recommendation, Track } from '../../types/music'

/** A song as the illustrations need it. `rank` is Deezer's popularity score. */
export interface ExampleSong { deezer_id: number; title: string; artist: string; cover: string; rank: number }

/** Seed of the walkthrough: "Reckoner" by Radiohead, at Discovery 0.5. */
export const SEED: Track = {
  "deezer_id": 138546815,
  "title": "Reckoner",
  "artist": "Radiohead",
  "artist_id": 399,
  "album": "In Rainbows",
  "cover": "https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg",
  "preview": "https://cdnt-preview.dzcdn.net/api/1/1/5/7/7/0/5779653d7f741f3c76001b21148c37f8.mp3?hdnea=exp=1794934753~acl=/api/1/1/5/7/7/0/5779653d7f741f3c76001b21148c37f8.mp3*~data=user_id=0,application_id=42~hmac=3428b19db52076f956efca1869575ee66db0547103a379b15ea0f6acdbbb4802",
  "link": "https://www.deezer.com/track/138546815",
  "rank": 752093,
  "isrc": "GBSTK0700007"
}

/** The ten songs that search returned, best first, with their match score. */
export const KEPT: (ExampleSong & { score: number })[] = [
  {
    "deezer_id": 138546817,
    "title": "House Of Cards",
    "artist": "Radiohead",
    "cover": "https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg",
    "rank": 643012,
    "score": 0.935
  },
  {
    "deezer_id": 108733456,
    "title": "Grace",
    "artist": "Jeff Buckley",
    "cover": "https://cdn-images.dzcdn.net/images/cover/57dd4754a69acaaf3a8a82f7fd1b8ad3/250x250-000000-80-0-0.jpg",
    "rank": 690336,
    "score": 0.8466
  },
  {
    "deezer_id": 3128094,
    "title": "Spies",
    "artist": "Coldplay",
    "cover": "https://cdn-images.dzcdn.net/images/cover/970dce98eeea6729244c0ae71707a83d/250x250-000000-80-0-0.jpg",
    "rank": 698182,
    "score": 0.8462
  },
  {
    "deezer_id": 68976286,
    "title": "1979",
    "artist": "The Smashing Pumpkins",
    "cover": "https://cdn-images.dzcdn.net/images/cover/c64acd4abaf6e8f2d7c895b4b73f3764/250x250-000000-80-0-0.jpg",
    "rank": 819079,
    "score": 0.758
  },
  {
    "deezer_id": 2657834,
    "title": "Do You Realize??",
    "artist": "The Flaming Lips",
    "cover": "https://cdn-images.dzcdn.net/images/cover/985f7e71bd80ec255087f8c2282d467e/250x250-000000-80-0-0.jpg",
    "rank": 505786,
    "score": 0.747
  },
  {
    "deezer_id": 3809258452,
    "title": "Breezeblocks",
    "artist": "alt-J",
    "cover": "https://cdn-images.dzcdn.net/images/cover/86ad6511178304fa3df49f716fdb4964/250x250-000000-80-0-0.jpg",
    "rank": 756898,
    "score": 0.7425
  },
  {
    "deezer_id": 3102138,
    "title": "Girls & Boys",
    "artist": "Blur",
    "cover": "https://cdn-images.dzcdn.net/images/cover/1e6f6130ca0ccbdd0cde4dc2b05e6df9/250x250-000000-80-0-0.jpg",
    "rank": 817974,
    "score": 0.7402
  },
  {
    "deezer_id": 14876844,
    "title": "Drive",
    "artist": "Incubus",
    "cover": "https://cdn-images.dzcdn.net/images/cover/f657c5dfd79ee673edac567f6dd2e7ee/250x250-000000-80-0-0.jpg",
    "rank": 785155,
    "score": 0.7391
  },
  {
    "deezer_id": 3590185,
    "title": "Starlight",
    "artist": "Muse",
    "cover": "https://cdn-images.dzcdn.net/images/cover/fc457d27a8c0b7fc6f9b56fb94e22a0d/250x250-000000-80-0-0.jpg",
    "rank": 926034,
    "score": 0.731
  },
  {
    "deezer_id": 422033092,
    "title": "Loser",
    "artist": "Beck",
    "cover": "https://cdn-images.dzcdn.net/images/cover/81c290ba09ab6b76305a118d42a0902a/250x250-000000-80-0-0.jpg",
    "rank": 764966,
    "score": 0.7265
  }
]

/** Real candidates of the same seed that didn't make that top ten. */
export const DROPPED: ExampleSong[] = [
  {
    "deezer_id": 936899,
    "title": "Where Is My Mind?",
    "artist": "Pixies",
    "cover": "https://cdn-images.dzcdn.net/images/cover/fa4a3bb8ef29a683940f740a6ef85601/250x250-000000-80-0-0.jpg",
    "rank": 935713
  },
  {
    "deezer_id": 2300683,
    "title": "E-Pro",
    "artist": "Beck",
    "cover": "https://cdn-images.dzcdn.net/images/cover/d5a83a410e714772719de8007160220c/250x250-000000-80-0-0.jpg",
    "rank": 446065
  },
  {
    "deezer_id": 1557745332,
    "title": "Twilight",
    "artist": "bôa",
    "cover": "https://cdn-images.dzcdn.net/images/cover/a56d7dac6980f4c4f2eb2e8221a5c226/250x250-000000-80-0-0.jpg",
    "rank": 565583
  }
]

/** One full result (#3 of that search), shown as the real card. */
export const SAMPLE: Recommendation = {
  "track": {
    "deezer_id": 3128094,
    "title": "Spies",
    "artist": "Coldplay",
    "artist_id": 892,
    "album": "Parachutes",
    "cover": "https://cdn-images.dzcdn.net/images/cover/970dce98eeea6729244c0ae71707a83d/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/951efdfc1b7797bd08e027f085fd0830.mp3?hdnea=exp=1794933187~acl=/api/1/1/9/5/1/0/951efdfc1b7797bd08e027f085fd0830.mp3*~data=user_id=0,application_id=42~hmac=2c8b51e79eee295c7a9be511afea8864b2a6356f312672363f6c31c39afff949",
    "link": "https://www.deezer.com/track/3128094",
    "rank": 698182,
    "isrc": "GBAYE0000568"
  },
  "score": 0.8462,
  "sound_similarity": 0.7995,
  "listener_score": 0.7692,
  "reasons": [
    {
      "kind": "listeners",
      "text": "Last.fm listeners of “Reckoner” also play this"
    },
    {
      "kind": "sound",
      "text": "Among the closest-sounding candidates (top 1%)"
    },
    {
      "kind": "sound",
      "text": "Both have: acoustic guitar, folk, jazzy"
    },
    {
      "kind": "tags",
      "text": "Shared tags: rock, alternative, alternative rock"
    }
  ]
}

/** Discovery demo: "Midnight City" by M83. These are the songs that differ
 *  between Discovery 0 and 1 (the other seven of the ten are the same), paired
 *  row by row with the song that takes its place. */
export const DISCOVERY_SEED: ExampleSong = {
  "deezer_id": 92198180,
  "title": "Midnight City",
  "artist": "M83",
  "cover": "https://cdn-images.dzcdn.net/images/cover/17116bb5bc20e30d915e569ec750f78d/250x250-000000-80-0-0.jpg",
  "rank": 909964
}
export const FAMILIAR: ExampleSong[] = [
  {
    "deezer_id": 878290932,
    "title": "Girls Just Wanna Have Some",
    "artist": "Chromatics",
    "cover": "https://cdn-images.dzcdn.net/images/cover/9e602c0b1057f1bdd8eb82172c67fc54/250x250-000000-80-0-0.jpg",
    "rank": 673335
  },
  {
    "deezer_id": 10240179,
    "title": "The Look",
    "artist": "Metronomy",
    "cover": "https://cdn-images.dzcdn.net/images/cover/9f672642bc8b1813bc682edc07078a82/250x250-000000-80-0-0.jpg",
    "rank": 882391
  },
  {
    "deezer_id": 3122441,
    "title": "What Else Is There?",
    "artist": "Röyksopp",
    "cover": "https://cdn-images.dzcdn.net/images/cover/b3cc07880bdcdc9d6703b6f99c70a602/250x250-000000-80-0-0.jpg",
    "rank": 532608
  }
]
export const DEEP: ExampleSong[] = [
  {
    "deezer_id": 882627592,
    "title": "Cherry",
    "artist": "Chromatics",
    "cover": "https://cdn-images.dzcdn.net/images/cover/04b3e8cae0e0bf29e823fce32678b425/250x250-000000-80-0-0.jpg",
    "rank": 508975
  },
  {
    "deezer_id": 34945401,
    "title": "Flutes",
    "artist": "Hot Chip",
    "cover": "https://cdn-images.dzcdn.net/images/cover/408cae1071042047f95e01a90b9b63f5/250x250-000000-80-0-0.jpg",
    "rank": 507494
  },
  {
    "deezer_id": 1899977437,
    "title": "Sordid Affair",
    "artist": "Röyksopp",
    "cover": "https://cdn-images.dzcdn.net/images/cover/2bf233439f257f00089474ac4dbc2d03/250x250-000000-80-0-0.jpg",
    "rank": 324812
  }
]
