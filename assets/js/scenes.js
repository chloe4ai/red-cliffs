import * as I from './ink.js';
import * as P from './portraits.js';

/**
 * scenes.js — one composition function per scene type.
 *
 * Signature: (ctx, W, H, pal, t, p, shot) where `t` is seconds elapsed within
 * the shot and `p` is 0→1 progress through it. The camera transform is already
 * applied by the engine, so these draw in plain frame coordinates.
 */

const CJK = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif';
const LATIN = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';

/* ------------------------------ title cards ------------------------------- */

function inkTitle(ctx, W, H, pal, t, p, shot, { big = true } = {}) {
  I.paper(ctx, W, H, pal);

  // Ink settles into the paper over the first beat.
  const settle = I.easeOut(Math.min(1, t / 1.6));
  const card = shot.card || {};

  // Optional period artwork behind the card, held well back so the title still
  // carries. Slow drift keeps it from reading as a flat pasted-in scan.
  if (shot.plate && P.has(shot.plate)) {
    const k = I.easeInOut(Math.min(1, t / 2.2));
    const zoom = 1 + p * 0.05;
    const bw = W * 1.02 * zoom;
    const bh = H * 1.02 * zoom;
    P.drawPortrait(ctx, shot.plate, [(W - bw) / 2, (H - bh) / 2 - p * 8, bw, bh], {
      inkColor: '#2b2c30', paperColor: pal.bg[0], alpha: 0.30 * k, feathered: true,
    });
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = pal.bg[0];
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cy = big ? H * 0.44 : H * 0.5;

  // Bleed behind the characters so they sit *in* the paper, not on it.
  I.bleed(ctx, W / 2, cy, (big ? 210 : 150) * settle, 'rgba(30,32,36,0.10)', 0.9);

  ctx.globalAlpha = settle;
  ctx.fillStyle = pal.text;
  ctx.font = `${big ? 168 : 104}px ${CJK}`;
  ctx.fillText(card.zh || '', W / 2, cy);

  ctx.globalAlpha = settle * 0.85;
  ctx.font = `${big ? 34 : 22}px ${LATIN}`;
  ctx.letterSpacing = big ? '18px' : '10px';
  ctx.fillText(card.en || '', W / 2, cy + (big ? 132 : 84));
  ctx.letterSpacing = '0px';

  if (shot.footer) {
    ctx.globalAlpha = settle * 0.55 * Math.min(1, Math.max(0, (t - 1.2) / 1.2));
    ctx.font = `17px ${LATIN}`;
    ctx.fillText(shot.footer, W / 2, H * 0.78);
  }
  ctx.restore();

  if (big) I.seal(ctx, W * 0.5 + 150, cy - 96, 1.25, card.zh || '赤壁', { alpha: settle * 0.9 });
  I.grain(ctx, W, H, 0.07);
}

export function titleCard(ctx, W, H, pal, t, p, shot) { inkTitle(ctx, W, H, pal, t, p, shot, { big: true }); }
export function chapterCard(ctx, W, H, pal, t, p, shot) { inkTitle(ctx, W, H, pal, t, p, shot, { big: false }); }

export function endCard(ctx, W, H, pal, t, p, shot) {
  inkTitle(ctx, W, H, pal, t, p, shot, { big: true });
}

/* ---------------------------- character plate ----------------------------- */

/**
 * The card that introduces a figure: portrait, name, rank, and the provenance
 * of the image. Provenance is on screen deliberately — these portraits are
 * genuine historical artefacts, and a 1607 woodblock deserves its credit in
 * frame rather than buried in a README.
 */
export function characterPlate(ctx, W, H, pal, t, p, shot) {
  const key = shot.portrait;
  const entry = P.CAST[key] || {};
  I.paper(ctx, W, H, pal);

  const inA = I.easeOut(I.clamp01(t / 0.9));
  const outA = I.clamp01((shot.dur - t) / 0.5);
  const a = inA * outA;

  // A wash of ink behind the figure, so the plate is not a floating cutout.
  I.bleed(ctx, W * 0.30, H * 0.53, H * 0.42, 'rgba(40,42,48,0.10)', a);

  const boxW = W * 0.30;
  const boxH = H * 0.66;
  const bx = W * 0.13;
  const by = H * 0.19;
  const drift = (1 - inA) * 14;   // settles into place rather than snapping in
  const drawn = P.drawPortrait(ctx, key, [bx, by + drift, boxW, boxH], {
    inkColor: '#191b1f', paperColor: pal.bg[0], alpha: a,
  });

  const tx = W * 0.50;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.globalAlpha = a;
  ctx.fillStyle = pal.text;
  ctx.font = `76px ${CJK}`;
  ctx.fillText(entry.zh || '', tx, H * 0.46);

  ctx.globalAlpha = a * 0.9;
  ctx.font = `24px ${LATIN}`;
  ctx.letterSpacing = '10px';
  ctx.fillText(entry.en || '', tx + 2, H * 0.545);
  ctx.letterSpacing = '0px';

  ctx.globalAlpha = a * 0.35;
  ctx.fillRect(tx + 2, H * 0.585, W * 0.20, 1);

  ctx.globalAlpha = a * 0.78;
  ctx.font = `26px ${CJK}`;
  ctx.fillText(entry.roleZh || '', tx + 2, H * 0.645);
  ctx.globalAlpha = a * 0.55;
  ctx.font = `15px ${LATIN}`;
  ctx.fillText(entry.roleEn || '', tx + 2, H * 0.685);

  // Provenance of the portrait itself.
  const src = P.has(key) ? P.info(key).source : entry.source;
  ctx.globalAlpha = a * 0.45 * I.clamp01((t - 1.1) / 0.8);
  ctx.font = `13px ${CJK}`;
  ctx.fillText(src || '', tx + 2, H * 0.76);

  if (!drawn) {
    ctx.globalAlpha = a * 0.4;
    ctx.font = `13px ${LATIN}`;
    ctx.fillText('[ portrait loading ]', bx, by + boxH / 2);
  }
  ctx.restore();

  I.grain(ctx, W, H, 0.07);
}

/* ------------------------------- river wide ------------------------------- */

export function riverWide(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  const dark = pal.dark;
  I.paper(ctx, W, H, pal);

  const horizon = H * 0.56;

  if (dark && pal === I.PALETTES.night) {
    I.stars(ctx, W, H, { t, alpha: 0.55 });
    I.moon(ctx, W * 0.74, H * 0.2, 26, { alpha: 0.9 });
  }
  if (pal === I.PALETTES.dawn) {
    I.bleed(ctx, W * 0.3, horizon, H * 0.55, 'rgba(255,190,140,0.55)', 0.5);
  }

  // Three ranges: pale and far, then closer and darker.
  I.ridge(ctx, { w: W, h: H, baseY: horizon + 4, amp: H * 0.20, seed: 12, color: pal.far, alpha: 0.9, jag: 2 });
  I.ridge(ctx, { w: W, h: H, baseY: horizon + 10, amp: H * 0.14, seed: 41, color: pal.mid, alpha: 0.85, jag: 3 });

  // The gorge walls.
  I.cliffWall(ctx, { w: W, h: H, side: 'left', width: W * 0.13, color: pal.near, alpha: 0.95, seed: 7 });
  I.cliffWall(ctx, { w: W, h: H, side: 'right', width: W * 0.16, color: pal.near, alpha: 0.95, seed: 19 });

  if (fx.mistBand) {
    I.mist(ctx, { w: W, h: H, y: horizon - 6, band: H * 0.1, t, alpha: fx.mistBand * 0.5, seed: 23 });
  }

  I.water(ctx, {
    w: W, h: H, y: horizon, color: pal.water, t, seed: 3,
    ripples: 30, alpha: 1,
    glowColor: dark ? (pal === I.PALETTES.dawn ? 'rgba(255,190,140,0.35)' : 'rgba(190,215,240,0.22)') : null,
    glowX: pal === I.PALETTES.dawn ? W * 0.3 : W * 0.74,
  });

  // The fleet, small and numerous, strung along the far bank.
  const n = fx.fleet || 0;
  const r = I.rng(77);
  for (let i = 0; i < n; i++) {
    const x = (i / Math.max(1, n - 1)) * W * 1.25 - W * 0.12;
    const depth = 0.25 + r() * 0.5;
    const y = horizon + depth * H * 0.09;
    const s = 0.16 + depth * 0.18;
    const rock = (fx.chop || 0.3) * Math.sin(t * 1.2 + i) * 1.5;
    I.junk(ctx, x, y + rock, s, { color: pal.near, alpha: 0.85, flip: i % 2 === 0, sails: 2, t, seed: i + 3 });
    if (fx.lanterns && i % 2 === 0) {
      I.bleed(ctx, x, y - 14 * s * 3, 26 * s * 3, 'rgba(255,190,110,0.9)', 0.5);
    }
  }

  if (fx.banners) {
    for (let i = 0; i < 3; i++) {
      const x = W * (0.16 + i * 0.32);
      I.banner(ctx, x, horizon + 22 + i * 8, 0.5, t, { color: pal.near, wind: fx.banners * 0.9, alpha: 0.9 });
    }
  }

  I.vignette(ctx, W, H, dark ? 0.55 : 0.3);
  I.grain(ctx, W, H, 0.05);
}

/* ------------------------------ fleet detail ------------------------------ */

export function fleetDetail(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  const horizon = H * 0.5;

  if (pal.dark) {
    I.stars(ctx, W, H, { t, alpha: 0.4, count: 60 });
    I.moon(ctx, W * 0.82, H * 0.16, 20, { alpha: 0.7 });
  }
  I.ridge(ctx, { w: W, h: H, baseY: horizon, amp: H * 0.16, seed: 61, color: pal.far, alpha: 0.7, jag: 2 });
  I.mist(ctx, { w: W, h: H, y: horizon, band: H * 0.08, t, alpha: 0.22, seed: 5 });
  I.water(ctx, { w: W, h: H, y: horizon + 6, color: pal.water, t, seed: 9, ripples: 26 });

  const count = fx.count || 6;
  const rock = fx.rock ?? 1;
  const ys = [];
  const xs = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * (W / count);
    const depth = i % 2 === 0 ? 0.45 : 0.62;
    const y = horizon + 40 + depth * H * 0.22 + Math.sin(t * 1.1 + i * 0.9) * 5 * rock;
    xs.push(x); ys.push(y);
    I.junk(ctx, x, y, 0.42 + depth * 0.4, {
      color: pal.near, alpha: 0.96, flip: false, sails: 2, t: t + i, seed: i + 11,
    });
  }

  if (fx.chains) {
    for (let i = 0; i < count - 1; i++) {
      I.chain(ctx, xs[i] + 22, ys[i] - 6, xs[i + 1] - 24, ys[i + 1] - 6, { color: pal.near, alpha: 0.85, sag: 10 });
    }
  }

  if (fx.watchers) {
    for (let i = 0; i < 4; i++) {
      I.figure(ctx, W * (0.18 + i * 0.2), H * 0.9, 0.5, { color: pal.near, alpha: 0.95, t: t + i });
    }
    // Foreground deck edge.
    ctx.fillStyle = pal.near;
    ctx.fillRect(0, H * 0.9, W, H * 0.1);
  }

  I.vignette(ctx, W, H, 0.5);
  I.grain(ctx, W, H, 0.05);
}

/* ------------------------------- deck figure ------------------------------ */

export function deckFigure(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);

  I.stars(ctx, W, H, { t, alpha: 0.6, count: 110 });
  if (fx.moon) I.moon(ctx, W * 0.68, H * 0.24, 40, { alpha: 0.95 });

  // A crow crossing the moon — the image from the poem.
  if (fx.crow) {
    const cp = (t / shot.dur);
    const cx = I.lerp(W * 0.95, W * 0.35, I.easeInOut(cp));
    const cy = H * 0.24 + Math.sin(cp * 7) * 16;
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = pal.fg;
    const flap = Math.sin(t * 9) * 7;
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy - flap);
    ctx.quadraticCurveTo(cx - 5, cy + 3, cx, cy);
    ctx.quadraticCurveTo(cx + 5, cy + 3, cx + 15, cy - flap);
    ctx.quadraticCurveTo(cx + 5, cy + 8, cx, cy + 4);
    ctx.quadraticCurveTo(cx - 5, cy + 8, cx - 15, cy - flap);
    ctx.fill();
    ctx.restore();
  }

  I.ridge(ctx, { w: W, h: H, baseY: H * 0.62, amp: H * 0.13, seed: 33, color: pal.far, alpha: 0.6, jag: 2 });
  I.water(ctx, {
    w: W, h: H, y: H * 0.64, color: pal.water, t, seed: 15, ripples: 22,
    glowColor: 'rgba(200,220,245,0.3)', glowX: W * 0.68,
  });

  // Deck: a hard black band with a rail, the figure standing against the sky.
  ctx.save();
  ctx.fillStyle = pal.near;
  ctx.fillRect(0, H * 0.82, W, H * 0.2);
  ctx.fillRect(0, H * 0.78, W, 6);
  for (let i = 0; i < 14; i++) ctx.fillRect(i * (W / 14) + 10, H * 0.78, 5, H * 0.05);
  ctx.restore();

  // Mast rising out of frame.
  ctx.save();
  ctx.fillStyle = pal.near;
  ctx.fillRect(W * 0.2 - 7, -20, 14, H * 0.84);
  ctx.restore();

  const n = fx.figures || 1;
  for (let i = 0; i < n; i++) {
    I.figure(ctx, W * (0.5 + i * 0.13), H * 0.82, 1.15, { color: pal.near, alpha: 1, t: t + i });
  }

  I.vignette(ctx, W, H, 0.55);
  I.grain(ctx, W, H, 0.05);
}

/* ------------------------------ council tent ------------------------------ */

export function councilTent(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  ctx.fillStyle = '#080c12';
  ctx.fillRect(0, 0, W, H);

  // Lamp — the only source, so everything is modelled off it.
  const lx = W * 0.5, ly = H * 0.42;
  const flick = 0.9 + Math.sin(t * 11) * 0.05 + Math.sin(t * 4.3) * 0.05;
  I.bleed(ctx, lx, ly, H * 0.72, 'rgba(255,180,90,0.5)', 0.5 * flick);
  I.bleed(ctx, lx, ly, H * 0.3, 'rgba(255,215,150,0.75)', 0.55 * flick);

  // Tent walls sloping in.
  ctx.save();
  ctx.fillStyle = 'rgba(10,12,16,0.85)';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W * 0.16, 0); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W, 0); ctx.lineTo(W * 0.84, 0); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  ctx.restore();

  // The map table.
  ctx.save();
  ctx.fillStyle = 'rgba(230,215,180,0.14)';
  ctx.beginPath();
  ctx.moveTo(W * 0.3, H * 0.66);
  ctx.lineTo(W * 0.7, H * 0.66);
  ctx.lineTo(W * 0.78, H * 0.8);
  ctx.lineTo(W * 0.22, H * 0.8);
  ctx.closePath();
  ctx.fill();
  // River drawn on the map.
  ctx.strokeStyle = 'rgba(200,180,140,0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.28, H * 0.75);
  ctx.quadraticCurveTo(W * 0.45, H * 0.68, W * 0.72, H * 0.74);
  ctx.stroke();
  ctx.restore();

  const n = fx.figures || 2;
  const xs = [0.34, 0.66, 0.5];
  for (let i = 0; i < n; i++) {
    I.figure(ctx, W * xs[i], H * 0.72, 1.5, { color: '#05070a', alpha: 1, flip: i === 1, t: t + i * 2 });
  }

  // The four characters written on a palm, held up.
  if (fx.palm) {
    const a = Math.min(1, Math.max(0, (t - 2.2) / 1.2));
    ctx.save();
    ctx.globalAlpha = a * 0.95;
    ctx.fillStyle = 'rgba(255,225,180,0.95)';
    ctx.font = `30px ${CJK}`;
    ctx.textAlign = 'center';
    ctx.fillText('東風', W * 0.5, H * 0.36);
    ctx.restore();
  }

  I.vignette(ctx, W, H, 0.7);
  I.grain(ctx, W, H, 0.06);
}

/* ---------------------------------- altar --------------------------------- */

export function altar(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  I.stars(ctx, W, H, { t, alpha: 0.75, count: 130 });

  // The Dipper, drawn true: seven stars, the bowl and the handle.
  if (fx.dipper) {
    const pts = [[0.60, 0.14], [0.66, 0.12], [0.71, 0.15], [0.70, 0.21], [0.76, 0.23], [0.81, 0.20], [0.86, 0.24]];
    ctx.save();
    const a = Math.min(1, Math.max(0, (t - 0.8) / 1.5));
    ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgba(200,225,255,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)));
    ctx.stroke();
    pts.forEach(([x, y]) => I.moon(ctx, x * W, y * H, 3.4, { alpha: a * 0.95 }));
    ctx.restore();
  }

  I.ridge(ctx, { w: W, h: H, baseY: H * 0.72, amp: H * 0.22, seed: 88, color: pal.mid, alpha: 0.9, jag: 3 });

  // Three tiers of rammed earth.
  ctx.save();
  ctx.fillStyle = pal.near;
  const tiers = [[0.30, 0.86, 0.40], [0.34, 0.79, 0.32], [0.38, 0.72, 0.24]];
  tiers.forEach(([x, y, w]) => {
    ctx.beginPath();
    ctx.moveTo(W * x, H * y);
    ctx.lineTo(W * (x + w), H * y);
    ctx.lineTo(W * (x + w - 0.02), H * (y - 0.075));
    ctx.lineTo(W * (x + 0.02), H * (y - 0.075));
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillRect(0, H * 0.86, W, H * 0.14);
  ctx.restore();

  // Braziers at the corners.
  [0.40, 0.60].forEach((x, i) => {
    I.flame(ctx, W * x, H * 0.645, 0.75, t + i * 1.7, { alpha: 0.9, seed: 40 + i });
  });

  const pose = fx.pose || 'stand';
  I.figure(ctx, W * 0.5, H * 0.645, 1.5, { color: pal.near, alpha: 1, pose, t });

  // Wind streaming past, once it comes.
  if (pose === 'arms-raised') {
    ctx.save();
    ctx.strokeStyle = 'rgba(200,225,255,0.18)';
    ctx.lineWidth = 1.4;
    const r = I.rng(4);
    for (let i = 0; i < 16; i++) {
      const y = H * (0.2 + r() * 0.55);
      const off = ((t * 260 * (0.5 + r())) % (W * 1.5)) - W * 0.25;
      const len = 60 + r() * 180;
      ctx.globalAlpha = 0.25 + r() * 0.5;
      ctx.beginPath();
      ctx.moveTo(off, y);
      ctx.quadraticCurveTo(off + len / 2, y - 6, off + len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  I.vignette(ctx, W, H, 0.55);
  I.grain(ctx, W, H, 0.05);
}

/* ------------------------------- wind banners ----------------------------- */

export function windBanners(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  I.stars(ctx, W, H, { t, alpha: 0.5, count: 70 });
  I.moon(ctx, W * 0.2, H * 0.2, 22, { alpha: 0.6 });
  I.ridge(ctx, { w: W, h: H, baseY: H * 0.78, amp: H * 0.16, seed: 55, color: pal.mid, alpha: 0.9, jag: 2 });

  ctx.fillStyle = pal.near;
  ctx.fillRect(0, H * 0.82, W, H * 0.2);

  // The wind turns during the shot — the single most important beat in the story.
  let wind = fx.wind ?? 0.1;
  if (fx.turning) {
    const k = I.easeInOut(Math.min(1, Math.max(0, (t - 1.2) / 2.6)));
    wind = I.lerp(-0.08, 1.05, k);
  } else {
    wind = -Math.abs(wind);
  }

  const glyphs = ['吳', '劉', '孫'];
  [0.28, 0.52, 0.76].forEach((x, i) => {
    I.banner(ctx, W * x, H * 0.83, 1.5, t + i * 0.4, {
      color: pal.near, wind, alpha: 1, glyph: glyphs[i], glyphColor: 'rgba(235,228,210,0.85)',
    });
  });

  if (fx.turning) {
    const k = Math.min(1, Math.max(0, (t - 1.6) / 2));
    ctx.save();
    ctx.strokeStyle = `rgba(210,230,255,${0.22 * k})`;
    ctx.lineWidth = 1.5;
    const r = I.rng(66);
    for (let i = 0; i < 22; i++) {
      const y = H * (0.15 + r() * 0.65);
      const off = ((t * 340 * (0.5 + r())) % (W * 1.6)) - W * 0.3;
      const len = 80 + r() * 220;
      ctx.beginPath();
      ctx.moveTo(off, y);
      ctx.quadraticCurveTo(off + len / 2, y - 7, off + len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  I.vignette(ctx, W, H, 0.5);
  I.grain(ctx, W, H, 0.05);
}

/* -------------------------------- fire ships ------------------------------ */

export function fireShips(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  const horizon = H * 0.52;

  if (pal === I.PALETTES.night) I.stars(ctx, W, H, { t, alpha: 0.4, count: 60 });
  I.ridge(ctx, { w: W, h: H, baseY: horizon, amp: H * 0.15, seed: 71, color: pal.far, alpha: 0.7, jag: 2 });

  // The target fleet, glowing faintly on the far bank.
  for (let i = 0; i < 9; i++) {
    const x = (i / 8) * W * 1.1 - W * 0.05;
    I.junk(ctx, x, horizon + 8, 0.2, { color: pal.near, alpha: 0.7, sails: 2, t, seed: i });
  }

  I.mist(ctx, { w: W, h: H, y: horizon + 4, band: H * 0.07, t, alpha: 0.2, seed: 13 });
  I.water(ctx, {
    w: W, h: H, y: horizon + 10, color: pal.water, t, seed: 21, ripples: 28,
    glowColor: fx.lit ? 'rgba(255,150,60,0.5)' : null, glowX: W * 0.5,
  });

  const n = fx.boats || 6;
  const rush = fx.rush ? I.easeIn(p) : 0;
  for (let i = 0; i < n; i++) {
    const lane = i / (n - 1);
    const x = W * (0.08 + lane * 0.84) + Math.sin(t * 0.7 + i) * 8;
    const adv = 0.2 + p * 0.35 + rush * 0.4;
    const y = horizon + 30 + adv * H * 0.34 + Math.sin(t * 1.6 + i) * 4;
    const s = 0.24 + adv * 0.42;
    I.junk(ctx, x, y, s, {
      color: pal.near, alpha: 0.98, sails: 1, t: t + i, seed: 50 + i,
      burning: fx.lit ? Math.min(1, (t / 1.2) * (0.6 + (i % 3) * 0.2)) : 0,
    });
    if (fx.lit) I.smoke(ctx, x, y - 60 * s, s * 1.4, t + i, { alpha: 0.3, seed: 90 + i, color: 'rgba(30,20,18,1)' });
  }

  I.vignette(ctx, W, H, 0.55);
  I.grain(ctx, W, H, 0.05);
}

/* --------------------------------- inferno -------------------------------- */

/**
 * The fleet burning.
 *
 * Built strictly back to front so the fire never eats the shapes: dark sky,
 * then the fire band as the only bright thing, then near-black ship
 * silhouettes standing against it, then smoke *in front* of the glow. Ship
 * placement is irregular and depth-sorted — evenly spaced identical hulls
 * read as decoration rather than a fleet.
 */
export function inferno(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  const k = fx.intensity ?? 1;
  const closeWater = Boolean(fx.closeWater);
  I.paper(ctx, W, H, pal);
  const horizon = H * (closeWater ? 0.34 : 0.5);
  const flick = 0.86 + Math.sin(t * 9) * 0.08 + Math.sin(t * 3.1) * 0.06;

  // The fire band — a low, wide, uneven bed of light along the waterline.
  const gr = I.rng(917);
  for (let i = 0; i < 9; i++) {
    const x = W * (-0.05 + gr() * 1.1);
    const rr = H * (0.16 + gr() * 0.26) * (0.7 + 0.5 * k) * flick;
    I.bleed(ctx, x, horizon + 6, rr, 'rgba(255,105,30,0.62)', 0.4 * k);
  }
  // A hotter core, tight to the water.
  for (let i = 0; i < 5; i++) {
    const x = W * (0.06 + gr() * 0.9);
    I.bleed(ctx, x, horizon + 10, H * 0.1 * flick, 'rgba(255,205,120,0.75)', 0.42 * k);
  }

  // Firelight thrown up onto the gorge walls — this is where the cliffs get their name.
  if (fx.cliffs) {
    I.ridge(ctx, { w: W, h: H, baseY: horizon - 4, amp: H * 0.34, seed: 91, color: 'rgba(126,42,18,0.72)', alpha: 0.95, jag: 2 });
    I.cliffWall(ctx, { w: W, h: H, side: 'left', width: W * 0.15, color: 'rgba(46,15,8,0.94)', seed: 3 });
    I.cliffWall(ctx, { w: W, h: H, side: 'right', width: W * 0.18, color: 'rgba(46,15,8,0.94)', seed: 8 });
  } else {
    I.ridge(ctx, { w: W, h: H, baseY: horizon - 2, amp: H * 0.2, seed: 91, color: 'rgba(40,16,9,0.9)', alpha: 0.9, jag: 2 });
  }

  I.water(ctx, {
    w: W, h: H, y: horizon + 6, color: pal.water, t, seed: 27,
    ripples: closeWater ? 46 : 32,
    glowColor: 'rgba(255,140,50,0.55)', glowX: W * 0.5, glowSpread: 0.42,
  });

  // Burning oil floating on the surface.
  if (closeWater) {
    const r = I.rng(19);
    for (let i = 0; i < 26; i++) {
      const x = r() * W;
      const y = horizon + 34 + r() * (H - horizon - 34);
      I.flame(ctx, x + Math.sin(t + i) * 12, y, 0.4 + r() * 0.8, t + i, { alpha: 0.9, seed: 100 + i });
    }
  }

  // Ships, placed irregularly and sorted so nearer hulls overlap farther ones.
  // Fewer, bigger hulls. A dozen small ones spread evenly reads as scenery;
  // four or five that crowd the frame reads as a fleet you are standing in.
  const n = Math.max(4, Math.round((fx.ships || 8) * 0.55));
  const pr = I.rng(555);
  const fleet = [];
  for (let i = 0; i < n; i++) {
    const depth = pr();                                   // 0 far → 1 near
    const x = W * (-0.08 + ((i + pr() * 0.8) / n) * 1.2);
    const y = horizon + 14 + depth * (H - horizon) * 0.66;
    const s = (closeWater ? 0.4 : 0.55) + depth * (closeWater ? 0.6 : 1.5);
    fleet.push({ x, y, s, depth, i });
  }
  fleet.sort((a, b) => a.depth - b.depth);

  // Chains still holding them together, which is the whole tragedy of it.
  for (let i = 0; i < fleet.length - 1; i++) {
    const a = fleet[i], b = fleet[i + 1];
    if (Math.abs(a.depth - b.depth) > 0.35) continue;
    I.chain(ctx, a.x + 26 * a.s, a.y - 8 * a.s, b.x - 26 * b.s, b.y - 8 * b.s, {
      color: 'rgba(12,5,3,0.92)', sag: 9, alpha: 0.8,
    });
  }

  // Fire mass first, hull second. The ship then reads as a black shape cut out
  // of the fire, which is the entire image of Red Cliffs.
  for (const f of fleet) {
    const burn = Math.min(1, k * (0.55 + ((f.i * 7) % 5) * 0.1));
    I.shipFire(ctx, f.x, f.y, f.s, t + f.i * 0.8, { intensity: burn, seed: 60 + f.i });
  }
  for (const f of fleet) {
    const burn = Math.min(1, k * (0.55 + ((f.i * 7) % 5) * 0.1));
    I.junk(ctx, f.x, f.y, f.s, {
      color: '#080403', alpha: 1, sails: 2, t: t + f.i, seed: 60 + f.i,
      flip: f.i % 3 === 0, burning: burn,
    });
  }

  // Smoke last, so it passes in front of the fire rather than under it.
  for (const f of fleet) {
    if (f.depth < 0.25) continue;
    I.smoke(ctx, f.x, f.y - 70 * f.s, f.s * 1.5, t + f.i * 1.3, {
      alpha: 0.5 * k, seed: 120 + f.i, color: 'rgba(20,14,12,1)', rise: 300, spread: 0.5,
    });
  }

  // A whisper of heat over the frame — enough to warm it, not to flatten it.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.045 * k * flick;
  ctx.fillStyle = 'rgba(255,130,50,1)';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  I.vignette(ctx, W, H, 0.62);
  I.grain(ctx, W, H, 0.06);
}

/* --------------------------------- fleeing -------------------------------- */

export function fleeing(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  const horizon = H * 0.6;

  // The burning river behind them, out of focus and enormous.
  const glow = fx.glow ?? 1;
  if (glow > 0.4) {
    for (let i = 0; i < 7; i++) {
      I.bleed(ctx, W * (0.05 + i * 0.16), horizon - 10, H * 0.42, 'rgba(255,110,35,0.5)', 0.4 * glow);
    }
    for (let i = 0; i < 5; i++) {
      I.smoke(ctx, W * (0.12 + i * 0.2), horizon - 30, 2.4, t + i * 2, {
        alpha: 0.4, seed: 200 + i, color: 'rgba(30,22,20,1)', rise: 260,
      });
    }
  } else {
    I.smoke(ctx, W * 0.5, horizon - 20, 3, t, { alpha: 0.3, seed: 210, color: 'rgba(40,42,48,1)', rise: 300 });
  }

  I.ridge(ctx, { w: W, h: H, baseY: horizon + 20, amp: H * 0.16, seed: 44, color: pal.mid, alpha: 0.9, jag: 2 });

  // Marsh road.
  ctx.save();
  ctx.fillStyle = pal.near;
  ctx.beginPath();
  ctx.moveTo(-20, H + 10);
  ctx.quadraticCurveTo(W * 0.35, H * 0.78, W * 0.55, horizon + 16);
  ctx.lineTo(W * 0.72, horizon + 16);
  ctx.quadraticCurveTo(W * 0.6, H * 0.82, W + 20, H + 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const n = fx.figures || 3;
  for (let i = 0; i < n; i++) {
    const q = i / Math.max(1, n - 1);
    const x = W * (0.32 + q * 0.34) + Math.sin(t * 0.9 + i) * 3;
    const y = horizon + 24 + q * H * 0.3;
    const s = 0.7 + q * 0.9;
    I.figure(ctx, x, y, s, { color: pal.fg, alpha: 1, t: t + i * 1.4, flip: true });
  }

  if (fx.rain) {
    ctx.save();
    ctx.strokeStyle = 'rgba(190,205,225,0.28)';
    ctx.lineWidth = 1.1;
    const r = I.rng(303);
    for (let i = 0; i < 220; i++) {
      const x = ((r() * W) + t * 90) % W;
      const y = ((r() * H) + t * 900) % H;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y + 22);
      ctx.stroke();
    }
    ctx.restore();
  }

  I.vignette(ctx, W, H, 0.6);
  I.grain(ctx, W, H, 0.05);
}

/* -------------------------------- dawn wreck ------------------------------ */

export function dawnWreck(ctx, W, H, pal, t, p, shot) {
  const fx = shot.fx || {};
  I.paper(ctx, W, H, pal);
  const horizon = H * 0.54;

  // A hard, bright band of sunrise low on the horizon — the only light in the
  // frame, so everything in front of it can go dark.
  I.bleed(ctx, W * 0.3, horizon - 6, H * 0.45, 'rgba(255,205,150,0.85)', 0.7);
  I.bleed(ctx, W * 0.3, horizon - 2, H * 0.18, 'rgba(255,240,215,0.9)', 0.55);

  I.ridge(ctx, { w: W, h: H, baseY: horizon + 2, amp: H * 0.2, seed: 12, color: 'rgba(120,95,88,0.55)', alpha: 0.9, jag: 2 });
  I.ridge(ctx, { w: W, h: H, baseY: horizon + 8, amp: H * 0.14, seed: 41, color: pal.mid, alpha: 0.95, jag: 3 });

  // Smoke stands straight up now — the wind has dropped. Dark against the
  // sunrise, which is what makes the columns read at all.
  const cols = fx.smokeCols || 5;
  for (let i = 0; i < cols; i++) {
    const x = W * (0.06 + (i / Math.max(1, cols - 1)) * 0.88);
    I.smoke(ctx, x, horizon + 22, 1.5, t + i * 3.1, {
      alpha: 0.6, seed: 300 + i, color: 'rgba(26,22,26,1)', rise: 520, spread: 0.22, puffs: 14,
    });
  }

  I.mist(ctx, { w: W, h: H, y: horizon + 6, band: H * 0.08, t, alpha: 0.3, seed: 31, speed: 3 });
  I.water(ctx, {
    w: W, h: H, y: horizon + 10, color: pal.water, t, seed: 33, ripples: 26,
    glowColor: 'rgba(255,205,155,0.5)', glowX: W * 0.3, glowSpread: 0.3,
  });

  // Wreckage, drifting with the current. Near-black so it sits *on* the lit
  // water rather than dissolving into it.
  const r = I.rng(404);
  const n = fx.debris || 12;
  const bits = [];
  for (let i = 0; i < n; i++) bits.push({ d: r(), j: r(), k: r(), i });
  bits.sort((a, b) => a.d - b.d);
  for (const b of bits) {
    const depth = b.d;
    const x = ((b.j * W * 1.3) + t * (5 + depth * 14)) % (W * 1.3) - W * 0.15;
    const y = horizon + 26 + depth ** 1.2 * (H - horizon - 34);
    const s = 0.22 + depth * 0.85;
    ctx.save();
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = '#0c0a0c';
    ctx.translate(x, y + Math.sin(t * 0.8 + b.i) * 2);
    ctx.rotate((b.k - 0.5) * 0.45);
    // Broken spars and hull fragments rather than whole ships.
    ctx.fillRect(-40 * s, -3 * s, 80 * s, 5.5 * s);
    if (b.i % 3 === 0) {
      ctx.save();
      ctx.rotate(-0.5 + b.k * 0.4);
      ctx.fillRect(-3 * s, -46 * s, 5 * s, 46 * s);
      ctx.restore();
    }
    if (b.i % 4 === 0) {
      ctx.beginPath();
      ctx.moveTo(-34 * s, 0);
      ctx.quadraticCurveTo(0, 16 * s, 34 * s, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Dark water in the immediate foreground to close the frame off.
  const fg = ctx.createLinearGradient(0, H * 0.86, 0, H);
  fg.addColorStop(0, 'rgba(10,8,10,0)');
  fg.addColorStop(1, 'rgba(10,8,10,0.85)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, H * 0.86, W, H * 0.14);

  I.vignette(ctx, W, H, 0.55);
  I.grain(ctx, W, H, 0.06);
}

export const SCENES = {
  characterPlate,
  titleCard, chapterCard, endCard, riverWide, fleetDetail, deckFigure,
  councilTent, altar, windBanners, fireShips, inferno, fleeing, dawnWreck,
};
