import { expandWorlds, addStoryTargets } from "./levels.js";
import { attachGangs } from "./encounters.js";
export const WORLD_WIDTH = 3072;
export const WORLD_HEIGHT = 2048;

export const WORLDS = {
  neon: {
    id: "neon",
    name: "NEON",
    chapter: "01",
    subtitle: "De stad die nooit slaapt",
    biome: "CYBERPUNK HAVENSTAD",
    accent: "#61ede4",
    color: "#1b4352",
    spawn: [270, 790],
    portrait: 1,
    intro:
      "Het eerste spoor naar je ouders loopt door NEON. Een gestolen transportmanifest kan vertellen waar de piraten hun energie vandaan halen.",
    mission: "Praat met Ilo op de avondmarkt.",
    objects: [
      {
        id: "neon-ship",
        type: "ship",
        x: 220,
        y: 850,
        name: "De Wayfarer",
        hint: "Terug naar je schip",
      },
      {
        id: "ilo",
        type: "npc",
        x: 480,
        y: 705,
        name: "Ilo",
        portrait: 1,
        hint: "Praat met Ilo",
      },
      {
        id: "neon-relay",
        type: "terminal",
        x: 910,
        y: 560,
        name: "Energierelais",
        hint: "Hack het energierelais",
      },
      {
        id: "neon-boss",
        type: "boss",
        x: 1100,
        y: 260,
        name: "K-9 · Havenwachter",
        hp: 100,
        damage: 15,
        hint: "Confronteer de havenwachter",
      },
      {
        id: "neon-drone",
        type: "enemy",
        x: 660,
        y: 450,
        name: "Scan-drone",
        hp: 50,
        damage: 10,
        hint: "Start een hackgevecht",
      },
      {
        id: "neon-cache",
        type: "chest",
        x: 320,
        y: 290,
        name: "Vergeten vrachtkist",
        hint: "Open de vrachtkist",
      },
      {
        id: "neon-secret",
        type: "secret",
        x: 1230,
        y: 720,
        name: "Versleutelde opslag",
        hint: "Hack de verborgen opslag",
      },
      { id: "neon-stars-a", type: "loot", x: 610, y: 770, name: "Stars" },
      { id: "neon-stars-b", type: "loot", x: 845, y: 350, name: "Stars" },
    ],
    obstacles: [
      [150, 140, 190, 100],
      [485, 150, 245, 150],
      [1030, 405, 190, 90],
      [80, 440, 160, 170],
      [1040, 810, 280, 100],
      [450, 890, 300, 75],
    ],
  },
  kage: {
    id: "kage",
    name: "KAGE",
    chapter: "02",
    subtitle: "De prijs van evenwicht",
    biome: "BAMBOE & ZWAARTEKRACHT",
    accent: "#dfc597",
    color: "#32433e",
    spawn: [270, 790],
    portrait: 2,
    intro:
      "Onder de tempels van KAGE ligt een zwaartekrachtanker. Vane gebruikt het om eilanden te gijzelen. Ren wil het herstellen. Kaito wil het vernietigen.",
    mission: "Zoek Meester Ren bij de torii-poort.",
    objects: [
      {
        id: "kage-ship",
        type: "ship",
        x: 200,
        y: 850,
        name: "De Wayfarer",
        hint: "Terug naar je schip",
      },
      {
        id: "ren",
        type: "npc",
        x: 460,
        y: 695,
        name: "Meester Ren",
        portrait: 2,
        hint: "Spreek Meester Ren",
      },
      {
        id: "kaito",
        type: "npc",
        x: 745,
        y: 730,
        name: "Kaito",
        portrait: 4,
        hint: "Spreek Kaito",
      },
      {
        id: "kage-anchor",
        type: "terminal",
        x: 890,
        y: 500,
        name: "Zwaartekrachtanker",
        hint: "Maak verbinding met het anker",
      },
      {
        id: "kage-boss",
        type: "boss",
        x: 1100,
        y: 250,
        name: "Vane · Graviton Mech",
        hp: 125,
        damage: 17,
        hint: "Daag Vane uit",
      },
      {
        id: "kage-drone",
        type: "enemy",
        x: 450,
        y: 415,
        name: "Piratenverkenner",
        hp: 60,
        damage: 12,
        hint: "Start een hackgevecht",
      },
      {
        id: "kage-cache",
        type: "chest",
        x: 230,
        y: 235,
        name: "Tempeloffer",
        hint: "Open het tempeloffer",
      },
      {
        id: "kage-secret",
        type: "secret",
        x: 1230,
        y: 725,
        name: "Verborgen archief",
        hint: "Ontgrendel het tempelarchief",
      },
      { id: "kage-stars", type: "loot", x: 620, y: 620, name: "Stars" },
    ],
    obstacles: [
      [100, 130, 210, 110],
      [530, 130, 230, 170],
      [1020, 420, 215, 110],
      [100, 465, 170, 130],
      [1070, 840, 235, 65],
    ],
  },
  citadel: {
    id: "citadel",
    name: "CITADEL",
    chapter: "03",
    subtitle: "Wat blijft er over van jou?",
    biome: "PIRATENFORT",
    accent: "#ff816e",
    color: "#472e3e",
    spawn: [270, 790],
    portrait: 3,
    intro:
      "De coördinaten komen uit op het fort van je oom. Je ouders leven. Tussen jou en hun cel staan één beveiligingskern en het gestolen Mech-Tech Armour.",
    mission: "Schakel de gevangenisbeveiliging uit.",
    objects: [
      {
        id: "citadel-ship",
        type: "ship",
        x: 195,
        y: 850,
        name: "De Wayfarer",
        hint: "Terug naar je schip",
      },
      {
        id: "citadel-core",
        type: "terminal",
        x: 655,
        y: 585,
        name: "Beveiligingskern",
        hint: "Hack de beveiligingskern",
      },
      {
        id: "citadel-boss",
        type: "boss",
        x: 1090,
        y: 265,
        name: "Piratenkapitein · Mech-Tech Armour",
        hp: 175,
        damage: 21,
        hint: "Confronteer je oom",
      },
      {
        id: "citadel-drone",
        type: "enemy",
        x: 820,
        y: 755,
        name: "Elite-bewaker",
        hp: 75,
        damage: 16,
        hint: "Start een hackgevecht",
      },
      {
        id: "citadel-cache",
        type: "chest",
        x: 280,
        y: 275,
        name: "In beslag genomen goederen",
        hint: "Open de kist",
      },
      {
        id: "citadel-secret",
        type: "secret",
        x: 1250,
        y: 720,
        name: "Gevangenenregister",
        hint: "Hack het register",
      },
      { id: "citadel-stars", type: "loot", x: 425, y: 690, name: "Stars" },
    ],
    obstacles: [
      [125, 125, 210, 110],
      [520, 135, 230, 175],
      [1040, 430, 210, 120],
      [115, 470, 170, 135],
      [1050, 840, 290, 90],
    ],
  },
};

expandWorlds(WORLDS);
addStoryTargets(WORLDS);
attachGangs(WORLDS);

export const DESTINATIONS = [
  {
    name: "NEON",
    id: "neon",
    type: "Cyberspace · Havenstad",
    x: 23,
    y: 39,
    color: "#61ede4",
  },
  {
    name: "KAGE",
    id: "kage",
    type: "Samurai · Zweefrotsen",
    x: 61,
    y: 68,
    color: "#dfc597",
  },
  {
    name: "CITADEL",
    id: "citadel",
    type: "Piratenfort · Finale",
    x: 80,
    y: 25,
    color: "#ff816e",
  },
  ...[
    ["FORGE", 40, 19],
    ["VIREL", 15, 72],
    ["PELAGOS", 45, 84],
    ["CINDER", 72, 86],
    ["MIRAGE", 55, 38],
    ["HOLLOW", 6, 24],
    ["MERIDIAN STATION", 40, 56],
    ["NOX", 85, 59],
    ["RIFT", 72, 45],
  ].map(([name, x, y]) => ({
    name,
    x,
    y,
    color: "#72808a",
    planned: true,
    type:
      name === "MERIDIAN STATION"
        ? "Orbitaal handelsstation"
        : "Volgende bestemming",
  })),
];

export const MINIGAMES = [
  "timing",
  "nodes",
  "memory",
  "wires",
  "logic",
  "rhythm",
  "maze",
  "chess",
  "sequence",
  "pipes",
  "frequency",
  "keypad",
  "asteroids",
  "clean",
  "balance",
  "locks",
];
export function availableDestinations(state) {
  return [
    "neon",
    ...(state.flags.neonBoss ? ["kage"] : []),
    ...(state.flags.kageBoss ? ["citadel"] : []),
  ];
}
export function missionFor(state, world) {
  const f = state.flags;
  if (world === "neon")
    return !f.neonTalk
      ? "Praat met Ilo op de avondmarkt."
      : !f.neonRelay
        ? "Hack het energierelais en open de laadroute."
        : !f.neonBoss
          ? "Versla K-9 en bemachtig het transportmanifest."
          : "KAGE is bereikbaar. Keer terug naar je schip of ontdek de opslag.";
  if (world === "kage")
    return !f.kageTalk
      ? "Spreek Meester Ren bij de torii-poort."
      : !f.kageAnchor
        ? "Hack het zwaartekrachtanker."
        : !f.kageChoice
          ? "Beslis over de toekomst van het anker."
          : !f.kageBoss
            ? "Versla Vane en neem zijn coördinaten."
            : "CITADEL is bereikbaar. Je ouders wachten.";
  return !f.citadelCore
    ? "Schakel de gevangenisbeveiliging uit."
    : !f.finalBoss
      ? "Confronteer de piratenkapitein."
      : "Vrije verkenning. Zoek alle drie de verborgen archieven.";
}

export function targetFor(state, world) {
  const f = state.flags;
  if (world === "neon")
    return !f.neonTalk
      ? "ilo"
      : !f.neonRelay
        ? "neon-relay"
        : !f.neonBoss
          ? "neon-boss"
          : "neon-ship";
  if (world === "kage")
    return !f.kageTalk
      ? "ren"
      : !f.kageAnchor || !f.kageChoice
        ? "kage-anchor"
        : !f.kageBoss
          ? "kage-boss"
          : "kage-ship";
  return !f.citadelCore
    ? "citadel-core"
    : !f.finalBoss
      ? "citadel-boss"
      : "citadel-ship";
}
