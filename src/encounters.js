import { damageFor } from "./state.js";
import { chipStats } from "./progression.js";

export const GANGS = {
  "neon-drone-2": {
    name: "De Kanaaljagers",
    members: [
      { name: "Kanaalpatrouille", role: "AANVOERDER", hp: 55, damage: 12 },
      { name: "Signaalsteler", role: "STOORZENDER", hp: 30, damage: 10 },
      { name: "Schrootjager", role: "VERKENNER", hp: 35, damage: 9 },
    ],
  },
  "kage-drone-2": {
    name: "De Rode Ronin",
    members: [
      { name: "Ronin-drone", role: "AANVOERDER", hp: 65, damage: 14 },
      { name: "Ankerwachter", role: "WACHTER", hp: 40, damage: 11 },
      { name: "Schaduwloper", role: "VERKENNER", hp: 35, damage: 12 },
    ],
  },
  "citadel-drone-2": {
    name: "Gebroken Zon · celbrigade",
    members: [
      { name: "Zware magazijnwacht", role: "AANVOERDER", hp: 80, damage: 16 },
      { name: "Celbewaker", role: "WACHTER", hp: 50, damage: 13 },
      { name: "Imperiale scanner", role: "STOORZENDER", hp: 40, damage: 12 },
    ],
  },
};
export function attachGangs(worlds) {
  for (const w of Object.values(worlds))
    for (const o of w.objects) {
      const gang = GANGS[o.id];
      if (gang) {
        o.gangName = gang.name;
        o.members = gang.members;
        o.hint = "Confronteer " + gang.name;
      }
    }
}
export function createBattle(obj, state) {
  const members = (obj.members || [obj]).map((m, i) => ({
    name: m.name,
    role: m.role || (obj.type === "boss" ? "BAAS" : "VIJAND"),
    maxHp: m.hp,
    hp:
      m.hp -
      (obj.id === "kage-boss" &&
      state.flags.kageChoice === "overload" &&
      i === 0
        ? 40
        : 0),
    damage: m.damage,
  }));
  const b = {
    ...obj,
    encounterName: obj.gangName || obj.name,
    members,
    active: 0,
    turn: 1,
    attempts: 0,
  };
  selectTarget(b, 0);
  return b;
}
export function selectTarget(b, index) {
  const m = b.members[index];
  if (!m || m.hp <= 0) return false;
  b.active = index;
  b.name = m.name;
  b.currentHp = m.hp;
  b.maxHp = m.maxHp;
  b.damage = m.damage;
  return true;
}
export const aliveMembers = (b) => b.members.filter((m) => m.hp > 0);
export const battleWon = (b) => !aliveMembers(b).length;
export function resolveBattleHack(b, state, ok) {
  const m = b.members[b.active];
  let result;
  if (ok) {
    const damage = damageFor(state);
    m.hp = Math.max(0, m.hp - damage);
    state.hp = Math.min(100, state.hp + chipStats(state).heal);
    state.hacks++;
    result = { ok, damage, name: m.name, defeated: m.hp === 0 };
    b.currentHp = m.hp;
    if (m.hp === 0 && !battleWon(b))
      selectTarget(
        b,
        b.members.findIndex((v) => v.hp > 0),
      );
  } else {
    const support = Math.max(0, aliveMembers(b).length - 1) * 2;
    const damage = Math.max(1, m.damage + support - chipStats(state).shield);
    state.hp = Math.max(0, state.hp - damage);
    result = { ok, damage, support, name: m.name };
  }
  b.turn++;
  return result;
}
export function battleRewards(b, state) {
  const boss = b.type === "boss",
    extra = b.members.length - 1;
  return {
    stars: (boss ? 60 : 18) + extra * 8 + chipStats(state).stars,
    bolts: (boss ? 5 : 2) + extra,
    chips: boss && state.chips < 3 ? 1 : 0,
  };
}
