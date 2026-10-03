import { normalizeEquipment, chipStats } from "./progression.js";
export const SAVE_KEY = "project-x-excalibur-v1";
export const freshState = () => ({
  version: 1,
  started: false,
  tool: false,
  world: "neon",
  hp: 100,
  maxHp: 100,
  stars: 0,
  bolts: 0,
  chips: 0,
  ownedChips: [],
  equippedChips: [],
  salvage: { lens: 0, relay: 0, blossom: 0, sigil: 0 },
  hacks: 0,
  flags: {},
  collected: [],
  defeated: [],
  log: [],
  lastHack: null,
});
export function readSave(storage = globalThis.localStorage) {
  try {
    const value = JSON.parse(storage?.getItem(SAVE_KEY));
    if (
      value?.version === 1 &&
      Array.isArray(value.collected) &&
      Array.isArray(value.defeated) &&
      value.flags &&
      typeof value.flags === "object" &&
      !Array.isArray(value.flags)
    ) {
      const state = {
        ...freshState(),
        ...value,
        hp: Math.max(1, Math.min(100, Number(value.hp) || 100)),
        maxHp: 100,
      };
      for (const key of ["stars", "bolts", "chips", "hacks"])
        state[key] = Math.max(0, Math.floor(Number(state[key]) || 0));
      state.chips = Math.min(3, state.chips);
      state.world = ["neon", "kage", "citadel"].includes(state.world)
        ? state.world
        : "neon";
      state.log = Array.isArray(state.log)
        ? state.log.filter((x) => typeof x === "string").slice(0, 30)
        : [];
      return normalizeEquipment(state);
    }
  } catch {}
  return freshState();
}
export function writeSave(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export function grant(state, { stars = 0, bolts = 0, chips = 0 }) {
  state.stars += stars;
  state.bolts += bolts;
  state.chips += chips;
}
export function purchase(state, cost, effect) {
  if (state.stars < cost) return false;
  state.stars -= cost;
  effect(state);
  return true;
}
export function record(state, text) {
  if (!state.log.includes(text)) state.log.unshift(text);
  state.log = state.log.slice(0, 30);
}
export function pickHack(state, pool, rng = Math.random) {
  const valid = pool.filter((x) => x !== state.lastHack);
  const choices = valid.length ? valid : pool;
  if (!choices.length) throw new Error("No compatible hack available");
  const type =
    choices[Math.min(choices.length - 1, Math.floor(rng() * choices.length))];
  state.lastHack = type;
  return type;
}
export function damageFor(state) {
  return 25 + Math.min(3, state.chips) * 5 + chipStats(state).damage;
}
