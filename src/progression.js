// Collectible software changes the player's build, never the random hack assignment.
export const CHIP_LIBRARY = {
  nullthread: { name: "Null Thread", rarity: "Rare", color: "#71b8ff", description: "+4 seconden en 2 minder counterschade. Nyx’ geschenk voor bevrijde stemmen.", time: 4, shield: 2, source: "Nyx · Wie spreekt er in de ruis?" },
  fieldheart: { name: "Veldhart", rarity: "Rare", color: "#71b8ff", description: "Herstel 4 HP en doe +3 schade na iedere geslaagde hack.", heal: 4, damage: 3, source: "Cass · Adem voor de benedenstad" },
  afterburn: { name: "Afterburn Drive", rarity: "Rare", color: "#71b8ff", description: "+40 loopsnelheid en +3 hackschade. Gebouwd uit Wayfarer-hardware.", speed: 40, damage: 3, source: "Flux · Een motor die terugkomt" },
  starsteel: { name: "Sterrenstaal", rarity: "Rare", color: "#71b8ff", description: "Vermindert counterschade met 5. Akari’s nieuwe eed.", shield: 5, source: "Akari · Het staal onthoudt" },
  inkmemory: { name: "Inktgeheugen", rarity: "Rare", color: "#71b8ff", description: "+7 seconden per hack en +2 Stars per vondst.", time: 7, stars: 2, source: "Sumi · De letters die overleven" },
  ronin: { name: "Ronin Protocol", rarity: "Rare", color: "#71b8ff", description: "+6 hackschade en 2 minder counterschade.", damage: 6, shield: 2, source: "Kaede · Een masker zonder meester" },
  voltpsalm: { name: "Voltpsalm", rarity: "Legendary", color: "#f3c06b", description: "+10 hackschade en +4 seconden. Een koor dat weer voor zichzelf spreekt.", damage: 10, time: 4, source: "Blackline Kathedraal · kernschat" },
  prismheart: { name: "Prismahart", rarity: "Exotic", color: "#e6a2ff", description: "+10 schade, herstel 5 HP per succes en +20 loopsnelheid.", damage: 10, heal: 5, speed: 20, source: "Prismakluis · kernschat" },
  bellguard: { name: "Klokkenwachter", rarity: "Legendary", color: "#f3c06b", description: "6 minder counterschade en +5 seconden. Het ritme van de eilanden.", shield: 6, time: 5, source: "Verdronken Klok · kernschat" },
  eclipse: { name: "Eclips Kernel", rarity: "Exotic", color: "#e6a2ff", description: "+12 schade, 4 minder counterschade en +4 seconden.", damage: 12, shield: 4, time: 4, source: "Maanoven · kernschat" },
  stormheart: { name: "Stormhart", rarity: "Legendary", color: "#f3c06b", description: "+8 schade en +30 loopsnelheid. Overmeester de Arc-Warden.", damage: 8, speed: 30, source: "ARC-WARDEN · gegarandeerde drop" },
  kitsune: { name: "Negenrode Zegel", rarity: "Legendary", color: "#f3c06b", description: "+7 schade, +4 seconden en 3 minder counterschade.", damage: 7, time: 4, shield: 3, source: "KUZUNOHA · gegarandeerde drop" },
  ghostlight: { name: "Spooklicht", rarity: "Legendary", color: "#f3c06b", description: "+6 seconden, herstel 4 HP per succes en +5 Stars per vondst.", time: 6, heal: 4, stars: 5, source: "Nyx’ vervolgquest / de Ster tussen de Ruis" },
  moonwake: { name: "Maanwaken", rarity: "Legendary", color: "#f3c06b", description: "4 minder counterschade, herstel 4 HP per succes en +25 loopsnelheid.", shield: 4, heal: 4, speed: 25, source: "Akari’s vervolgquest / Wat de Maan Bewaart" },
  overclock: {
    name: "Overclock",
    rarity: "Rare",
    color: "#71b8ff",
    description: "+5 schade per geslaagde battle-hack.",
    damage: 5,
    price: 95,
  },
  buffer: {
    name: "Tijdsbuffertje",
    rarity: "Uncommon",
    color: "#8bd6ab",
    description: "+5 seconden bij iedere hack.",
    time: 5,
    price: 70,
  },
  aegis: {
    name: "Aegis-plaat",
    rarity: "Rare",
    color: "#71b8ff",
    description: "Vermindert schade van een tegenaanval met 3.",
    shield: 3,
    price: 110,
  },
  scavenger: {
    name: "Sterrenzoeker",
    rarity: "Rare",
    color: "#71b8ff",
    description: "+4 Stars bij pickups, kisten en verslagen vijanden.",
    stars: 4,
    price: 90,
  },
  flow: {
    name: "Flow Circuit",
    rarity: "Uncommon",
    color: "#8bd6ab",
    description: "+25 loopsnelheid tijdens verkenning.",
    speed: 25,
    price: 80,
  },
  lifeline: {
    name: "Phoenix Protocol",
    rarity: "Legendary",
    color: "#e5b86b",
    description: "Herstel 5 HP na een geslaagde battle-hack.",
    heal: 5,
    price: 180,
  },
  harmony: {
    name: "Kage Resonance",
    rarity: "Legendary",
    color: "#e5b86b",
    description: "+3 seconden per hack en 2 minder schade van tegenaanvallen.",
    time: 3,
    shield: 2,
    price: 170,
  },
  paradox: {
    name: "Paradox Kernel",
    rarity: "Exotic",
    color: "#d9a0fb",
    description: "+8 hackschade en +15 loopsnelheid.",
    damage: 8,
    speed: 15,
    price: 240,
  },
};
export const SALVAGE = {
  lens: {
    name: "Prismalens",
    value: 14,
    icon: "◇",
    description: "Een oude optische lens met een bruikbare kern.",
  },
  relay: {
    name: "Kwantumrelais",
    value: 22,
    icon: "▱",
    description:
      "Illegale piratenelektronica. Handelaren betalen voor onderdelen.",
  },
  blossom: {
    name: "Kristalbloesem",
    value: 18,
    icon: "✣",
    description: "Een lichtgevend kristal uit de tuinen van Kage.",
  },
  sigil: {
    name: "Keizerlijk zegel",
    value: 35,
    icon: "⌁",
    description: "Een verzegelde module uit de Citadel.",
  },
};
export const TRADERS = {
  "neon-rhea": {
    name: "Rhea’s Wisselmarkt",
    tag: "VASTE WINKEL / AVONDMARKT",
    line: "Geen keizerlijk krediet. Geen vragen. Alleen Stars.",
    stock: ["buffer", "overclock", "scavenger"],
    healing: 15,
  },
  "neon-sol": {
    name: "Sol’s Sterrenkaravaan",
    tag: "REIZENDE HANDELAAR",
    line: "Ik volg de veilige straten. Mijn voorraad komt van werelden die niet meer op de kaart staan.",
    stock: ["flow", "aegis"],
    healing: 12,
    wandering: true,
  },
  "kage-yui": {
    name: "De Stille Werkplaats",
    tag: "TEMPELWINKEL",
    line: "Een chip maakt je sterker. Weten wanneer je hem gebruikt, maakt je wijzer.",
    stock: ["aegis", "harmony"],
    healing: 12,
  },
  "kage-taro": {
    name: "Taro’s Lantaarnroute",
    tag: "REIZENDE HANDELAAR",
    line: "Mijn karavaan verbindt de landing met de tempels. Die piraten gaan mijn route niet bepalen.",
    stock: ["scavenger", "buffer", "overclock"],
    healing: 10,
    wandering: true,
  },
  "citadel-dr-vale": {
    name: "Vale’s Noodpost",
    tag: "MEDISCHE WERKPLAATS",
    line: "Chips, onderdelen, verband. Alles wat nog één leven kan redden.",
    stock: ["lifeline", "aegis"],
    healing: 8,
  },
  "citadel-echo": {
    name: "ECHO’s Verboden Voorraad",
    tag: "REIZENDE HANDELAAR",
    line: "Prijs berekend. Loyaliteit aan de kapitein: verwijderd.",
    stock: ["paradox", "harmony", "overclock"],
    healing: 15,
    wandering: true,
  },
};
export function normalizeEquipment(state) {
  state.ownedChips = [
    ...new Set(Array.isArray(state.ownedChips) ? state.ownedChips : []),
  ].filter((id) => CHIP_LIBRARY[id]);
  state.equippedChips = [
    ...new Set(Array.isArray(state.equippedChips) ? state.equippedChips : []),
  ]
    .filter((id) => state.ownedChips.includes(id))
    .slice(0, 2);
  state.salvage = Object.fromEntries(
    Object.keys(SALVAGE).map((id) => [
      id,
      Math.max(0, Math.min(999, Math.floor(Number(state.salvage?.[id]) || 0))),
    ]),
  );
  return state;
}
export function chipStats(state) {
  const result = { damage: 0, time: 0, shield: 0, stars: 0, speed: 0, heal: 0 };
  for (const id of state.equippedChips || []) {
    const c = CHIP_LIBRARY[id];
    if (!c) continue;
    for (const key of Object.keys(result)) result[key] += c[key] || 0;
  }
  return result;
}
export function acquireChip(state, id) {
  if (!CHIP_LIBRARY[id]) return false;
  state.ownedChips ??= [];
  if (state.ownedChips.includes(id)) {
    state.stars += 30;
    return false;
  }
  state.ownedChips.push(id);
  return true;
}
export function toggleChip(state, id) {
  if (!state.ownedChips?.includes(id)) return false;
  state.equippedChips ??= [];
  if (state.equippedChips.includes(id)) {
    state.equippedChips = state.equippedChips.filter((v) => v !== id);
    return true;
  }
  if (state.equippedChips.length >= 2) return false;
  state.equippedChips.push(id);
  return true;
}
export function buyChip(state, trader, id) {
  if (!TRADERS[trader]?.stock.includes(id)) return "unknown";
  if (state.ownedChips?.includes(id)) return "owned";
  const cost = CHIP_LIBRARY[id].price;
  if (state.stars < cost) return "funds";
  state.stars -= cost;
  acquireChip(state, id);
  return "bought";
}
export function sellSalvage(state) {
  let stars = 0;
  for (const [id, item] of Object.entries(SALVAGE)) {
    stars += (state.salvage?.[id] || 0) * item.value;
    if (state.salvage) state.salvage[id] = 0;
  }
  state.stars += stars;
  return stars;
}
export function salvageDrop(state, world, large = false, rng = Math.random) {
  state.salvage ??= {};
  const choices =
    world === "kage"
      ? ["blossom", "lens", "relay"]
      : world === "citadel"
        ? ["sigil", "relay", "lens"]
        : ["lens", "relay"];
  const id =
    choices[Math.min(choices.length - 1, Math.floor(rng() * choices.length))];
  state.salvage[id] = (state.salvage[id] || 0) + (large ? 2 : 1);
  return SALVAGE[id].name;
}
