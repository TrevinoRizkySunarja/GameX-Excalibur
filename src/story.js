export const PIRATE_FACTION = "De Gebroken Zon";
export const PROLOGUE = [
  {
    title: "Voor de stilte",
    speaker: "Moeder",
    portrait: "mother",
    image: "prologue-1",
    text: "Luister naar me. Wat er buiten ook gebeurt: jij moet blijven leven. We vinden je terug. Dat beloof ik.",
  },
  {
    title: "De laatste vlucht",
    speaker: "Vader",
    portrait: "father",
    image: "prologue-2",
    text: "De Wayfarer kent de route. ARI zal voor je zorgen. Ga nu aan boord. Neem onze kist mee en kijk niet om.",
  },
  {
    title: "Aan de andere kant van het glas",
    speaker: "Jij",
    portrait: "hero",
    image: "prologue-3",
    text: "Ik druk mijn hand tegen het raam. Die van mijn moeder raakt de andere kant. Dan sluit de luchtsluis. Voor het eerst ben ik alleen.",
  },
  {
    title: "De Gebroken Zon",
    speaker: "Piratenkapitein",
    portrait: "captain",
    image: "prologue-4",
    text: "Breng de ouders levend aan boord. Hun kernenergie behoort voortaan aan mijn vloot. Zoek het kind. Geen schip verlaat deze wereld.",
  },
  {
    title: "Tussen onbekende sterren",
    speaker: "ARI",
    portrait: "ari",
    image: "prologue-5",
    text: "Ontsnappingsroute bevestigd. Ik kan hun signalen niet meer bereiken. Maar zolang de Wayfarer vliegt, is je verhaal nog niet voorbij.",
  },
  {
    title: "Een verboden prototype",
    speaker: "ARI",
    portrait: "ari",
    image: "prologue-6",
    text: "Jaren later vind je de Omni-Tool in de kist van je ouders. Zijn energie is voor anderen dodelijk. Jouw bloed kan hem geleiden. Begin met één verbinding. Daarna gaan we hen zoeken.",
  },
];
export const CHARACTERS = {
  hero: {
    name: "Jij",
    hair: "#263142",
    skin: "#e4bba1",
    coat: "#387b85",
    accent: "#ef9b63",
    kind: "young",
  },
  mother: {
    name: "Moeder",
    hair: "#343040",
    skin: "#e6b9a5",
    coat: "#d2c4b1",
    accent: "#6b9fa5",
    kind: "bob",
  },
  father: {
    name: "Vader",
    hair: "#645146",
    skin: "#d8b49c",
    coat: "#497d87",
    accent: "#debd82",
    kind: "adult",
  },
  captain: {
    name: "Piratenkapitein",
    hair: "#a6a6ad",
    skin: "#c8a392",
    coat: "#43374b",
    accent: "#d95659",
    kind: "elder",
  },
  ilo: { name: "Ilo", coat: "#c38253", accent: "#6dd8d0", kind: "robot" },
  ari: { name: "ARI", coat: "#436177", accent: "#74d7e0", kind: "robot" },
  k9: { name: "K-9", coat: "#3b5162", accent: "#e78579", kind: "robot" },
  vane: {
    name: "Vane · Graviton Mech",
    coat: "#746375",
    accent: "#ebbb79",
    kind: "robot",
  },
  ren: {
    name: "Meester Ren",
    hair: "#d9ddce",
    skin: "#d5b9a4",
    coat: "#728474",
    accent: "#e0b77e",
    kind: "elder",
  },
  kaito: {
    name: "Kaito",
    hair: "#293448",
    skin: "#dfb19a",
    coat: "#4c5a69",
    accent: "#ce686b",
    kind: "young",
  },
  mira: {
    name: "Mira",
    hair: "#43363b",
    skin: "#cf9e82",
    coat: "#ba8b55",
    accent: "#78bfc3",
    kind: "ponytail",
  },
  nori: {
    name: "Nori",
    hair: "#374c59",
    skin: "#e7bea1",
    coat: "#7e7297",
    accent: "#c6b1c2",
    kind: "bob",
  },
  aya: {
    name: "Aya",
    hair: "#655248",
    skin: "#e0b295",
    coat: "#65856c",
    accent: "#d8c98e",
    kind: "ponytail",
  },
  juno: {
    name: "Juno",
    hair: "#96989a",
    skin: "#d4b098",
    coat: "#527789",
    accent: "#aabed3",
    kind: "adult",
  },
  rhea: {
    name: "Rhea",
    hair: "#463449",
    skin: "#d3a48d",
    coat: "#775b76",
    accent: "#d39ba3",
    kind: "bob",
  },
  sol: {
    name: "Sol",
    hair: "#687174",
    skin: "#cfa789",
    coat: "#547d73",
    accent: "#d6b485",
    kind: "adult",
  },
  hana: {
    name: "Hana",
    hair: "#775447",
    skin: "#e7bda7",
    coat: "#857198",
    accent: "#e1afbd",
    kind: "bob",
  },
  taro: {
    name: "Taro",
    hair: "#686159",
    skin: "#d5ae8e",
    coat: "#a18257",
    accent: "#e4c797",
    kind: "adult",
  },
  yui: {
    name: "Yui",
    hair: "#39485b",
    skin: "#ddbaa5",
    coat: "#536f81",
    accent: "#e1c18c",
    kind: "ponytail",
  },
  zen: {
    name: "Zen",
    hair: "#504344",
    skin: "#caa28a",
    coat: "#735967",
    accent: "#d18886",
    kind: "adult",
  },
  vale: {
    name: "Dr. Vale",
    hair: "#c3c5ca",
    skin: "#dbb49b",
    coat: "#6f94a3",
    accent: "#dfd8c4",
    kind: "adult",
  },
  sera: {
    name: "Sera",
    hair: "#7a585c",
    skin: "#deb49f",
    coat: "#8a7797",
    accent: "#e0bbad",
    kind: "bob",
  },
  echo: { name: "ECHO", coat: "#7e8494", accent: "#bcabc9", kind: "robot" },
};
export function characterFor(person, portraitId = 5) {
  const value = person.toLowerCase();
  if (/kapitein|oom/.test(value)) return "captain";
  if (/vale/.test(value)) return "vale";
  return (
    Object.keys(CHARACTERS).find((id) => value.includes(id)) ||
    ["hero", "ilo", "ren", "captain", "kaito", "ari"][portraitId] ||
    "ari"
  );
}
export function imageForCharacter(id) {
  return {
    ilo: "chapter-1",
    ren: "chapter-2",
    kaito: "chapter-3",
    mira: "chapter-4",
    hana: "chapter-5",
  }[id];
}
export const BOSS_INTROS = {
  "neon-boss": {
    speaker: "K-9 · Havenwachter",
    portrait: "k9",
    text: "Onbevoegde verbinding gedetecteerd. Dat manifest blijft hier. De Gebroken Zon staat geen getuigen toe.",
  },
  "kage-boss": {
    speaker: "Vane",
    portrait: "vane",
    image: "chapter-3",
    text: "Je denkt dat één gerepareerd anker vrijheid betekent? Mijn Ronin beheersen deze wereld. Laat zien wat die gestolen tool waard is.",
  },
  "citadel-boss": {
    speaker: "Piratenkapitein",
    portrait: "captain",
    image: "prologue-4",
    text: "Je bent teruggekomen. Het bloed van onze familie heeft je tot hier gebracht. Geef mij de Omni-Tool en je mag je ouders nog één keer zien.",
  },
};
