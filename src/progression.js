// Collectible software changes the player's build, never the random hack assignment.
export const CHIP_LIBRARY = {
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
