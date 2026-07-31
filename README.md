# Red Cliffs 赤壁

An **animatic** of the Battle of Red Cliffs, adapted from *Romance of the Three Kingdoms*
(三國演義), chapters 48–50.

33 shots, 3 minutes 21 seconds, with a synthesised score — and it exports a real `.webm`
video file you can play anywhere.

**Every frame is drawn procedurally in code.** There is no photography, no stock footage
and no generated imagery anywhere in this repository. The visual language is ink-wash
(水墨) because that is a register code can actually execute well — silhouette, value,
negative space and bleed rather than texture and detail — and because a night river battle
of burning ships is exactly what ink is good at.

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
  film.js      the screenplay — 33 shots with slugs, action, camera, dialogue, cues
  ink.js       the ink-wash drawing library (brush, bleed, ridge, water, junk, flame, smoke)
  scenes.js    one composition function per scene type
  engine.js    timeline, camera, transitions, captions, letterbox
  audio.js     the score, synthesised with Web Audio — no audio files
  export.js    canvas capture → WebM
  app.js       transport, shot list, wiring
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
