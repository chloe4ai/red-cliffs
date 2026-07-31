# Red Cliffs 赤壁

An **animatic** of the Battle of Red Cliffs, adapted from *Romance of the Three Kingdoms*
(三國演義), chapters 48–50.

33 shots, 3 minutes 21 seconds, with a synthesised score — and it exports a real `.webm`
video file you can play anywhere.

**Every scene is drawn procedurally in code**, with one deliberate exception: the human
faces. Those are genuine **public-domain historical portraits** — Ming woodblock and Qing
繡像 — normalised into the film's own ink and paper (see [Portraits](#portraits)). There is
no stock footage and no AI-generated imagery anywhere in the repository.

The visual language is ink-wash (水墨) because that is a register code can actually execute
well — silhouette, value, negative space and bleed rather than texture and detail — and
because a night river battle of burning ships is exactly what ink is good at.

---

## What this is, and what it is not

This is **not** a feature film, and no current system can produce one. Today's video models
generate clips of a few seconds in which characters do not stay consistent between shots.
There is no long-form narrative continuity, no feature-quality lip-synced dialogue, and no
editorial coherence.

What this *is* is the artifact that genuinely precedes a film: the **animatic** — the timed
storyboard with dialogue, camera moves and score that a real production cuts before it
shoots, to test whether a sequence works. It is a complete, finished thing of its own kind.

## Rights

*Romance of the Three Kingdoms* is attributed to Luo Guanzhong, c. 14th century, and is
**public domain**. It can be adapted freely, which is why it was chosen. A living author's
work — Mo Yan, for instance — could not be adapted this way without optioned film rights.

The same reasoning governs the portraits. Stills from *The Advisors Alliance* (軍師聯盟),
the 1994 CCTV *Three Kingdoms* or the 2010 series are **copyrighted audiovisual works**, and
the actors have likeness rights on top of that — so they are not in this repository and
should not be added to it. The bundled portraits are pre-20th-century works whose copyright
has expired. If you want live-action faces, use the local override path below, which keeps
them on your machine and out of the published repo.

## Portraits

Five characters get a portrait plate on first appearance and a cut-in when they speak.

| Character | Portrait | Source | Status |
|---|---|---|---|
| 曹操 Cao Cao | bust | 王圻《三才圖會》c. 1607 | Public domain |
| 諸葛亮 Zhuge Liang | bust | 《三才圖會》萬曆三十七年 (1609) | Public domain |
| 周瑜 Zhou Yu | full length | 清代繡像本 | Public domain |
| 黃蓋 Huang Gai | full length | 清代繡像本 | Public domain |
| 龐統 Pang Tong | full length | 清代繡像本 | Public domain |

All five are from Wikimedia Commons; per-file URLs, artists, dates and licences are recorded
in [`assets/portraits/sources.json`](assets/portraits/sources.json). Provenance is also
printed on each plate in-frame, because a 1607 woodblock deserves its credit on screen
rather than buried in a README.

### Using your own images

A Ming woodblock, a Qing line drawing and a modern photograph have nothing in common
tonally, and dropping them into one film unedited looks like three different productions.
So every portrait goes through the same normalisation — auto levels, duotone into the
film's ink and paper, grain, feathered edge. Line art and photographs need different
handling (turning a photo into an alpha mask destroys its midtones), so the mode is
**detected from the image itself**.

That is what makes swapping in your own material work. Three ways:

1. **Grab a frame from video** — the best option if you have the footage. Drop a video file
   onto the page, scrub to the frame you want, step a frame at a time, and capture. Full
   resolution, your choice of expression, no hunting for stills. Verified end to end: a
   1280×720 frame goes from video to portrait without leaving the machine.
2. **Cast portraits panel** — pick an image file per character. Applies immediately.
3. **`characters/` directory** — drop in `cao-cao.jpg`, `zhou-yu.png`, and so on, then
   refresh. The engine prefers these over the bundled portraits. Dragging an image onto the
   page assigns it to whichever character is on screen.

Everything you supply stays in the browser (or in `characters/`, which is **gitignored**).
Nothing is uploaded, and nothing is committed. That is the point: use licensed stills or
your own footage privately, without putting anything into a public repository that
shouldn't be there.

One implementation constraint worth knowing if you extend this: images and video frames
must be **same-origin** — bundled files, `characters/`, or a `blob:` URL from a local file.
A cross-origin image taints the canvas, and a tainted canvas silently kills `toDataURL` and
`captureStream`, which means the film can no longer be exported at all. That is checked
after every change.

## Running it

No build step. Any static server:

```bash
python3 -m http.server 4790 --directory .
```

Then open <http://localhost:4790>.

- **Space** plays and pauses, **←/→** skip five seconds
- Click any shot in the list to jump to it
- **Director's view** burns the shot number, slug, camera move and timecode into the frame,
  the way a working animatic is usually reviewed

## Exporting the video

Press **Export .webm**. The result is a real VP9 + Opus WebM at 1280×720, 30fps, with the
score muxed in.

Two honest caveats:

- **It records in real time.** Exporting a 3:21 film takes 3:21. `MediaRecorder` timestamps
  frames against the wall clock, so pushing frames faster produces a file with compressed
  timestamps — a sped-up video, not a faster export. Leave the tab visible while it runs.
- **The file has no duration header.** Live-recorded WebM omits it, so some players show the
  length as unknown until fully buffered. It plays correctly regardless. To write a clean
  header, remux without re-encoding:

  ```bash
  ffmpeg -i red-cliffs-animatic.webm -c copy red-cliffs.webm
  ```

Export needs Chrome or Edge. Playback works everywhere.

## How it is built

```
assets/js/
  film.js       the screenplay — 38 shots with slugs, action, camera, dialogue, cues
  ink.js        the ink-wash drawing library (brush, bleed, ridge, water, junk, flame, smoke)
  scenes.js     one composition function per scene type
  portraits.js  portrait loading, tonal normalisation, plates and cut-ins
  engine.js     timeline, camera, transitions, captions, letterbox
  audio.js      the score, synthesised with Web Audio — no audio files
  export.js     canvas capture → WebM
  app.js        transport, shot list, cast panel, wiring
assets/portraits/   bundled public-domain portraits + sources.json
characters/         your own images (gitignored, never committed)
```

`film.js` is the actual creative document: change a duration, a camera move or a line of
dialogue there and the film changes. Everything else renders it.

The engine is **deterministic** — `render(time)` produces the same image for the same
timestamp on every call, and nothing depends on wall-clock or on how many frames came
before. That is what makes seeking and clean recording possible.

### Things that took real work

- **Fire had to be drawn behind the ships, not on them.** The first pass put flames on each
  hull and the fleet turned into a row of glowing blobs — boats with birthday candles. Ships
  now render as pure black silhouettes *cut out of* a fire mass drawn behind them, which is
  the entire iconography of Red Cliffs.
- **Flames are clusters of leaning, asymmetric tongues.** A single symmetric shape becomes an
  obvious traffic cone the moment you scale it up.
- **The camera clamps itself.** At zoom *z* the focal point cannot travel closer than
  1/(2*z*) to a frame edge without panning off the drawn area and exposing bare canvas. The
  engine enforces this rather than trusting each shot to respect it — a slightly shortened
  pan is invisible, a hard seam down the frame is not.
- **Water reflections are a soft pool with broken glints**, not a gradient wedge. Drawn as a
  wedge it reads as a spotlight cone, which is the one thing water never looks like.

## Credits

Adapted from **Romance of the Three Kingdoms** (三國演義), attributed to Luo Guanzhong,
c. 14th century. Public domain.

Code: MIT.
