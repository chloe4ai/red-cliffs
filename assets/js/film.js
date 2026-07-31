/**
 * film.js — the screenplay.
 *
 * Adapted from Romance of the Three Kingdoms (三國演義), attributed to Luo
 * Guanzhong, c. 14th century — public domain. Chapters 48–50: the Battle of
 * Red Cliffs, winter of 208 AD.
 *
 * This is the document everything else renders. Each entry is one shot, with
 * its slug line, action, camera move and sound cue — the same information a
 * shot list carries on a real production, in a form the engine can play.
 *
 * cam: [x, y, zoom] start → end, in fractions of frame. Zoom 1 = full frame.
 */

export const META = {
  title: 'RED CLIFFS',
  titleZh: '赤壁',
  source: 'Romance of the Three Kingdoms, ch. 48–50 · Luo Guanzhong · public domain',
  format: 'Animatic / previsualisation',
};

const SEC = (n) => n;

export const SHOTS = [
  /* ---------------------------- I. THE FLEET ----------------------------- */
  {
    id: 1, scene: 'titleCard', dur: SEC(5.5), palette: 'ink', trans: 'fade', cue: 'silence',
    slug: 'MAIN TITLE',
    action: 'Ink on paper. The title bleeds into the fibre and settles.',
    card: { zh: '赤壁', en: 'RED CLIFFS' },
    footer: 'from ROMANCE OF THE THREE KINGDOMS',
  },
  {
    id: 2, scene: 'riverWide', dur: SEC(7), palette: 'night', trans: 'dissolve', cue: 'drone',
    cam: [0.5, 0.5, 1.0, 0.5, 0.48, 1.06],
    slug: 'EXT. THE YANGTZE RIVER — NIGHT',
    action: 'The river, black and enormous. Cliffs on both banks. Nothing moves but the water.',
    sub: 'Winter, 208 AD. The Yangtze.',
    fx: { fleet: 0, mistBand: 0.5 },
  },
  {
    id: 3, scene: 'riverWide', dur: SEC(7.5), palette: 'night', trans: 'dissolve', cue: 'drone',
    cam: [0.38, 0.5, 1.15, 0.62, 0.5, 1.15],
    slug: 'EXT. THE NORTHERN BANK — NIGHT',
    action: 'Lights. Then more. The fleet of Cao Cao stretches past both edges of frame.',
    sub: 'Cao Cao has come south with eight hundred thousand men.',
    fx: { fleet: 26, mistBand: 0.35, lanterns: true },
  },
  {
    id: 4, scene: 'fleetDetail', dur: SEC(6), palette: 'night', trans: 'cut', cue: 'drone',
    cam: [0.5, 0.55, 1.3, 0.5, 0.52, 1.12],
    slug: 'EXT. CAO CAO\'S FLEET — NIGHT',
    action: 'Hull after hull, gunwale to gunwale. The ships are close enough to step between.',
    sub: 'His navy is the largest the river has ever carried.',
    fx: { chains: false, count: 7 },
  },
  {
    id: 5, scene: 'characterPlate', dur: SEC(4.2), palette: 'ink', trans: 'cut', cue: 'guqin',
    portrait: 'cao-cao',
    slug: 'CHARACTER PLATE — CAO CAO',
    action: 'Portrait plate. Wang Qi, Sancai Tuhui, c. 1607.',
  },
  {
    id: 6, scene: 'deckFigure', dur: SEC(7), palette: 'night', trans: 'dissolve', cue: 'guqin',
    cam: [0.5, 0.5, 1.0, 0.5, 0.5, 1.14],
    portrait: 'cao-cao',
    slug: 'EXT. THE FLAGSHIP, DECK — NIGHT',
    action: 'CAO CAO stands alone at the rail with a cup. The moon is very bright. Few stars.',
    speaker: 'CAO CAO', line: '對酒當歌，人生幾何？',
    sub: '"Before wine, sing — for how long is a life?"',
    fx: { moon: true, figures: 1 },
  },
  {
    id: 7, scene: 'deckFigure', dur: SEC(7), palette: 'night', trans: 'cut', cue: 'guqin',
    cam: [0.5, 0.44, 1.2, 0.5, 0.4, 1.28],
    slug: 'EXT. THE FLAGSHIP, DECK — CONTINUOUS',
    action: 'A single crow crosses the moon, flying south. Cao Cao watches it go.',
    speaker: 'CAO CAO', line: '月明星稀，烏鵲南飛。',
    sub: '"The moon is bright, the stars are few. The crows fly south."',
    fx: { moon: true, figures: 1, crow: true },
  },
  {
    id: 7, scene: 'fleetDetail', dur: SEC(5), palette: 'night', trans: 'cut', cue: 'unease',
    cam: [0.5, 0.5, 1.25, 0.5, 0.56, 1.25],
    slug: 'EXT. THE FLEET — NIGHT',
    action: 'The ships roll. Sick men at the rails. Northerners, every one of them.',
    sub: 'His soldiers are horsemen. The river makes them ill.',
    fx: { count: 5, rock: 1.6 },
  },
  {
    id: 8, scene: 'characterPlate', dur: SEC(4), palette: 'ink', trans: 'cut', cue: 'unease',
    portrait: 'pang-tong',
    slug: 'CHARACTER PLATE — PANG TONG',
    action: 'Portrait plate. Qing dynasty illustrated edition.',
  },
  {
    id: 9, scene: 'fleetDetail', dur: SEC(6.5), palette: 'night', trans: 'dissolve', cue: 'unease',
    cam: [0.5, 0.5, 1.1, 0.5, 0.5, 1.0],
    portrait: 'pang-tong',
    slug: 'EXT. THE FLEET — LATER',
    action: 'Iron is brought aboard. The hulls are lashed and chained, bow to stern, until the fleet is one deck.',
    speaker: 'PANG TONG', line: 'Chain the ships together, Prime Minister. Your men will not feel the river.',
    fx: { count: 7, chains: true, rock: 0.2 },
  },
  {
    id: 9, scene: 'fleetDetail', dur: SEC(5), palette: 'night', trans: 'dissolve', cue: 'unease',
    cam: [0.5, 0.5, 1.0, 0.5, 0.5, 1.18],
    slug: 'EXT. THE FLEET — CONTINUOUS',
    action: 'The rolling stops. The men stand easy. Nothing on the water can move independently again.',
    sub: 'The fleet is steady now. It is also a single target.',
    fx: { count: 7, chains: true, rock: 0 },
  },

  /* --------------------------- II. THE SOUTH ----------------------------- */
  {
    id: 10, scene: 'chapterCard', dur: SEC(3.6), palette: 'ink', trans: 'fade', cue: 'silence',
    slug: 'CHAPTER CARD',
    action: 'Ink title.',
    card: { zh: '南岸', en: 'THE SOUTHERN BANK' },
  },
  {
    id: 110, scene: 'characterPlate', dur: SEC(4), palette: 'ink', trans: 'cut', cue: 'strings',
    portrait: 'zhou-yu',
    slug: 'CHARACTER PLATE — ZHOU YU',
    action: 'Portrait plate. Qing dynasty illustrated edition.',
  },
  {
    id: 111, scene: 'characterPlate', dur: SEC(4), palette: 'ink', trans: 'cut', cue: 'strings',
    portrait: 'zhuge-liang',
    slug: 'CHARACTER PLATE — ZHUGE LIANG',
    action: 'Portrait plate. Sancai Tuhui, 1609.',
  },
  {
    id: 11, scene: 'councilTent', dur: SEC(6.5), palette: 'night', trans: 'dissolve', cue: 'strings',
    cam: [0.5, 0.5, 1.2, 0.5, 0.5, 1.05],
    slug: 'INT. ZHOU YU\'S TENT — NIGHT',
    action: 'A lamp. A map weighted at the corners. ZHOU YU and ZHUGE LIANG on opposite sides of it.',
    sub: 'Wu and Shu have thirty thousand men between them.',
    fx: { figures: 2 },
  },
  {
    id: 12, scene: 'councilTent', dur: SEC(7), palette: 'night', trans: 'cut', cue: 'strings',
    cam: [0.44, 0.52, 1.35, 0.56, 0.52, 1.35],
    slug: 'INT. ZHOU YU\'S TENT — CONTINUOUS',
    action: 'Zhou Yu writes four characters on his palm and shows them. Zhuge Liang writes the same four on his own.',
    portrait: 'zhou-yu', speaker: 'ZHOU YU', line: '萬事俱備，只欠東風。',
    sub: '"Everything is ready. We lack only the east wind."',
    fx: { figures: 2, palm: true },
  },
  {
    id: 13, scene: 'riverWide', dur: SEC(6), palette: 'night', trans: 'cut', cue: 'unease',
    cam: [0.5, 0.46, 1.0, 0.5, 0.46, 1.0],
    slug: 'EXT. THE RIVER — NIGHT',
    action: 'Banners on the southern shore stream steadily north-west. The wrong way. Fire sent from here would blow back into their own ships.',
    sub: 'In winter the wind comes from the north-west. It has done so for a month.',
    fx: { fleet: 14, banners: -1, mistBand: 0.4 },
  },

  /* ---------------------------- III. THE WIND ---------------------------- */
  {
    id: 14, scene: 'altar', dur: SEC(6.5), palette: 'night', trans: 'dissolve', cue: 'ritual',
    cam: [0.5, 0.62, 1.25, 0.5, 0.5, 1.0],
    slug: 'EXT. THE SEVEN-STAR ALTAR, NANPING HILL — NIGHT',
    action: 'Three tiers of earth. ZHUGE LIANG climbs, barefoot, hair unbound.',
    sub: 'Zhuge Liang asks for three days.',
    fx: { figures: 1, pose: 'stand' },
  },
  {
    id: 15, scene: 'altar', dur: SEC(7), palette: 'night', trans: 'cut', cue: 'ritual',
    cam: [0.5, 0.5, 1.0, 0.5, 0.42, 1.3],
    slug: 'EXT. THE ALTAR — CONTINUOUS',
    action: 'He raises his arms. Behind him the seven stars of the Dipper stand clear of cloud.',
    portrait: 'zhuge-liang', speaker: 'ZHUGE LIANG', line: '借東風。',
    sub: '"Borrow the east wind."',
    fx: { figures: 1, pose: 'arms-raised', dipper: true },
  },
  {
    id: 16, scene: 'windBanners', dur: SEC(5.5), palette: 'night', trans: 'cut', cue: 'hold',
    cam: [0.5, 0.5, 1.15, 0.5, 0.5, 1.15],
    slug: 'EXT. THE SOUTHERN SHORE — NIGHT',
    action: 'A banner hangs slack. Absolutely still. Held far too long.',
    fx: { wind: 0.02 },
  },
  {
    id: 17, scene: 'windBanners', dur: SEC(6), palette: 'night', trans: 'cut', cue: 'swell',
    cam: [0.5, 0.5, 1.15, 0.5, 0.5, 1.0],
    slug: 'EXT. THE SOUTHERN SHORE — CONTINUOUS',
    action: 'The cloth stirs. Lifts. Turns — and stands out hard to the north-east.',
    sub: 'On the third night, the wind changes.',
    fx: { wind: 1, turning: true },
  },
  {
    id: 18, scene: 'riverWide', dur: SEC(5), palette: 'night', trans: 'cut', cue: 'swell',
    cam: [0.5, 0.5, 1.2, 0.5, 0.5, 1.0],
    slug: 'EXT. THE RIVER — NIGHT',
    action: 'Every banner on both shores swings the same way at once. East wind, hard, straight at the chained fleet.',
    fx: { fleet: 22, banners: 1, mistBand: 0.15, chop: 1.4 },
  },

  /* ---------------------------- IV. THE FIRE ----------------------------- */
  {
    id: 19, scene: 'chapterCard', dur: SEC(3.4), palette: 'ink', trans: 'fade', cue: 'silence',
    slug: 'CHAPTER CARD',
    action: 'Ink title.',
    card: { zh: '火攻', en: 'THE FIRE ATTACK' },
    plate: 'red-cliffs',
    footer: '馬駘《赤壁縱火》1928',
  },
  {
    id: 199, scene: 'characterPlate', dur: SEC(4), palette: 'ink', trans: 'cut', cue: 'approach',
    portrait: 'huang-gai',
    slug: 'CHARACTER PLATE — HUANG GAI',
    action: 'Portrait plate. Qing dynasty illustrated edition.',
  },
  {
    id: 20, scene: 'fireShips', dur: SEC(6.5), palette: 'night', trans: 'dissolve', cue: 'approach',
    cam: [0.5, 0.55, 1.3, 0.5, 0.5, 1.1],
    slug: 'EXT. THE RIVER, MID-CHANNEL — NIGHT',
    action: 'Twenty small boats come out of the dark under sail. Their decks are stacked with dry reed and soaked in oil.',
    sub: 'Huang Gai has sent word that he will surrender at the third watch.',
    fx: { boats: 8, lit: 0 },
  },
  {
    id: 21, scene: 'fleetDetail', dur: SEC(5), palette: 'night', trans: 'cut', cue: 'approach',
    cam: [0.5, 0.5, 1.0, 0.5, 0.5, 1.2],
    slug: 'EXT. CAO CAO\'S FLEET — NIGHT',
    action: 'Men on the northern deck point at the approaching sails. Nobody moves to arms. A surrender is expected.',
    speaker: 'OFFICER', line: 'It is Huang Gai, Prime Minister. He comes as he promised.',
    fx: { count: 7, chains: true, watchers: true },
  },
  {
    id: 22, scene: 'fireShips', dur: SEC(5.5), palette: 'fire', trans: 'cut', cue: 'ignite',
    cam: [0.5, 0.5, 1.1, 0.5, 0.5, 1.35],
    slug: 'EXT. THE FIRE SHIPS — CONTINUOUS',
    action: 'At a hundred paces the reed is lit. All twenty boats catch at once and keep their heading.',
    sub: 'They do not slow.',
    fx: { boats: 8, lit: 1 },
  },
  {
    id: 23, scene: 'fireShips', dur: SEC(5), palette: 'fire', trans: 'cut', cue: 'impact',
    cam: [0.5, 0.5, 1.35, 0.5, 0.5, 1.0],
    slug: 'EXT. THE FIRE SHIPS — CONTINUOUS',
    action: 'The east wind takes them. They cross the last of the water very fast.',
    fx: { boats: 8, lit: 1, rush: 1 },
  },
  {
    id: 24, scene: 'inferno', dur: SEC(6), palette: 'fire', trans: 'cut', cue: 'impact',
    cam: [0.5, 0.5, 1.4, 0.5, 0.5, 1.05],
    slug: 'EXT. CAO CAO\'S FLEET — CONTINUOUS',
    action: 'Impact. The first hulls take the fire and pass it along the chain, ship to ship, exactly as iron was meant to hold them.',
    fx: { intensity: 0.55, ships: 6 },
  },
  {
    id: 25, scene: 'inferno', dur: SEC(6.5), palette: 'fire', trans: 'cut', cue: 'inferno',
    cam: [0.42, 0.5, 1.2, 0.6, 0.48, 1.2],
    slug: 'EXT. THE FLEET — CONTINUOUS',
    action: 'The fire runs the length of the fleet. Nothing can pull clear. That was the point of the chains.',
    sub: 'The ships cannot separate.',
    fx: { intensity: 0.85, ships: 9 },
  },
  {
    id: 26, scene: 'inferno', dur: SEC(7), palette: 'fire', trans: 'cut', cue: 'inferno',
    cam: [0.5, 0.55, 1.0, 0.5, 0.4, 1.25],
    slug: 'EXT. THE RIVER — CONTINUOUS',
    action: 'Wide. The river is burning from bank to bank. The cliffs above are lit red — and take their name from it.',
    sub: 'The cliffs are red from bank to bank.',
    fx: { intensity: 1, ships: 12, cliffs: true },
  },
  {
    id: 27, scene: 'inferno', dur: SEC(5.5), palette: 'fire', trans: 'cut', cue: 'inferno',
    cam: [0.5, 0.5, 1.45, 0.5, 0.5, 1.45],
    slug: 'EXT. THE WATER — CONTINUOUS',
    action: 'Close on the surface. Burning oil floats. The water itself is alight.',
    fx: { intensity: 1, ships: 3, closeWater: true },
  },

  /* --------------------------- V. THE RETREAT ---------------------------- */
  {
    id: 28, scene: 'fleeing', dur: SEC(6), palette: 'fire', trans: 'cut', cue: 'retreat',
    cam: [0.55, 0.5, 1.25, 0.42, 0.5, 1.15],
    slug: 'EXT. THE NORTHERN SHORE — CONTINUOUS',
    action: 'Cao Cao is taken off the flagship. Behind him his navy is a wall of fire a li wide.',
    portrait: 'cao-cao', speaker: 'CAO CAO', line: 'Ride. Do not look back at it.',
    fx: { figures: 3, glow: 1 },
  },
  {
    id: 29, scene: 'fleeing', dur: SEC(6), palette: 'night', trans: 'cut', cue: 'retreat',
    cam: [0.5, 0.5, 1.1, 0.5, 0.5, 1.3],
    slug: 'EXT. THE ROAD NORTH — LATER',
    action: 'Mud, rain, and a road through marsh. The army that came south is walking.',
    sub: 'Of eight hundred thousand, a fraction reaches the north.',
    fx: { figures: 5, glow: 0.25, rain: true },
  },

  /* ---------------------------- VI. AFTERMATH ---------------------------- */
  {
    id: 30, scene: 'dawnWreck', dur: SEC(7.5), palette: 'dawn', trans: 'dissolve', cue: 'aftermath',
    cam: [0.5, 0.45, 1.2, 0.5, 0.5, 1.0],
    slug: 'EXT. THE YANGTZE — DAWN',
    action: 'Grey light. Smoke standing straight up off the water in columns. Wreckage as far as the frame goes.',
    sub: 'Morning.',
    fx: { smokeCols: 7, debris: 14 },
  },
  {
    id: 31, scene: 'dawnWreck', dur: SEC(7), palette: 'dawn', trans: 'cut', cue: 'aftermath',
    cam: [0.4, 0.5, 1.3, 0.62, 0.52, 1.15],
    slug: 'EXT. THE RIVER — CONTINUOUS',
    action: 'The current carries what is left of the fleet south, unhurried.',
    sub: 'The empire will be divided three ways for the next sixty years.',
    fx: { smokeCols: 4, debris: 18 },
  },
  {
    id: 32, scene: 'riverWide', dur: SEC(6.5), palette: 'dawn', trans: 'dissolve', cue: 'aftermath',
    cam: [0.5, 0.5, 1.0, 0.5, 0.5, 1.08],
    slug: 'EXT. THE YANGTZE — FULL DAY',
    action: 'The river again, as in the first shot. Empty. It has taken back the whole of it.',
    fx: { fleet: 0, mistBand: 0.6 },
  },
  {
    id: 33, scene: 'endCard', dur: SEC(8), palette: 'ink', trans: 'fade', cue: 'end',
    slug: 'END CARD',
    action: 'Ink on paper.',
    card: { zh: '赤壁', en: 'RED CLIFFS' },
    footer: 'Romance of the Three Kingdoms · Luo Guanzhong · c. 14th century',
  },
];

export const RUNTIME = SHOTS.reduce((a, s) => a + s.dur, 0);

/**
 * Cumulative start time of each shot, so the scrubber can seek.
 *
 * Shot numbers are derived from position rather than authored, so inserting a
 * shot mid-reel doesn't require renumbering everything after it.
 */
export const TIMELINE = (() => {
  let t = 0;
  return SHOTS.map((s, i) => {
    const entry = { ...s, id: i + 1, start: t, end: t + s.dur };
    t += s.dur;
    return entry;
  });
})();

export function shotAt(time) {
  for (const s of TIMELINE) if (time >= s.start && time < s.end) return s;
  return TIMELINE[TIMELINE.length - 1];
}
