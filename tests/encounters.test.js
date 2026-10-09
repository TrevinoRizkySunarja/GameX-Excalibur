import test from "node:test";
import assert from "node:assert/strict";
import { WORLDS } from "../src/data.js";
import { freshState } from "../src/state.js";
import {
  GANGS,
  createBattle,
  selectTarget,
  resolveBattleHack,
  battleWon,
  battleRewards,
} from "../src/encounters.js";

test("a gang only ends after every member is defeated, with wounds retained across target changes", () => {
  const s = freshState(),
    o = WORLDS.neon.objects.find((o) => o.id === "neon-drone-2"),
    b = createBattle(o, s);
  assert.equal(b.members.length, 3);
  resolveBattleHack(b, s, true);
  assert.equal(b.members[0].hp, 30);
  selectTarget(b, 1);
  resolveBattleHack(b, s, true);
  assert.equal(b.members[1].hp, 5);
  resolveBattleHack(b, s, true);
  assert.equal(selectTarget(b, 1), false);
  assert.equal(b.members[0].hp, 30);
  assert.equal(battleWon(b), false);
  while (!battleWon(b)) resolveBattleHack(b, s, true);
  assert.equal(s.defeated.length, 0); // Only the victory controller can grant/record an encounter.
  assert.deepEqual(battleRewards(b, s), { stars: 34, bolts: 4, chips: 0 });
});
test("living support increases a counterattack; eliminating a support unit reduces pressure", () => {
  const s = freshState(),
    b = createBattle(
      WORLDS.neon.objects.find((o) => o.id === "neon-drone-2"),
      s,
    );
  assert.equal(resolveBattleHack(b, s, false).damage, 16);
  s.chips = 3;
  selectTarget(b, 1);
  resolveBattleHack(b, s, true);
  assert.equal(b.members[1].hp, 0);
  selectTarget(b, 0);
  assert.equal(resolveBattleHack(b, s, false).damage, 14);
  s.ownedChips = s.equippedChips = ["aegis"];
  assert.equal(resolveBattleHack(b, s, false).damage, 11);
});
test("single enemies retain earlier damage/rewards and KAGE overload still weakens its boss", () => {
  const s = freshState(),
    kage = WORLDS.kage.objects.find((o) => o.id === "kage-boss");
  assert.equal(createBattle(kage, s).currentHp, 125);
  s.flags.kageChoice = "overload";
  const b = createBattle(kage, s);
  assert.equal(b.currentHp, 85);
  assert.equal(b.maxHp, 125);
  assert.deepEqual(battleRewards(b, s), { stars: 60, bolts: 5, chips: 1 });
  for (const [id, gang] of Object.entries(GANGS)) {
    const o = Object.values(WORLDS)
      .flatMap((w) => w.objects)
      .find((o) => o.id === id);
    assert.equal(o.type, "enemy");
    assert.equal(o.members, gang.members);
    assert.ok(o.members.every((m) => m.hp > 0 && m.damage > 0));
  }
});
