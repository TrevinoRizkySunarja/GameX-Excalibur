import test from "node:test";
import assert from "node:assert/strict";
import { freshState, readSave, writeSave, damageFor } from "../src/state.js";
import {
  CHIP_LIBRARY,
  TRADERS,
  buyChip,
  toggleChip,
  chipStats,
  acquireChip,
  sellSalvage,
  salvageDrop,
} from "../src/progression.js";
import {
  QUESTS,
  questReady,
  questsFor,
  trackedTarget,
} from "../src/contracts.js";
import { WORLDS } from "../src/data.js";
test("special chips require ownership, use two slots, alter stats and survive reload", () => {
  const s = freshState();
  assert.equal(toggleChip(s, "paradox"), false);
  ["overclock", "buffer", "flow"].forEach((id) => acquireChip(s, id));
  assert.equal(toggleChip(s, "overclock"), true);
  assert.equal(toggleChip(s, "buffer"), true);
  assert.equal(toggleChip(s, "flow"), false);
  assert.equal(damageFor(s), 30);
  assert.equal(chipStats(s).time, 5);
  assert.equal(toggleChip(s, "overclock"), true);
  assert.equal(toggleChip(s, "flow"), true);
  assert.equal(chipStats(s).speed, 25);
  let json;
  const storage = { setItem: (k, v) => (json = v), getItem: () => json };
  writeSave(s, storage);
  assert.deepEqual(readSave(storage), s);
});
test("merchants enforce their stock, prices and single ownership", () => {
  const s = freshState();
  s.stars = 100;
  assert.equal(buyChip(s, "neon-rhea", "paradox"), "unknown");
  assert.equal(buyChip(s, "neon-rhea", "overclock"), "bought");
  assert.equal(s.stars, 5);
  assert.equal(buyChip(s, "neon-rhea", "overclock"), "owned");
  assert.equal(buyChip(s, "neon-rhea", "buffer"), "funds");
  assert.equal(s.stars, 5);
});
test("duplicate quest chips compensate and cargo sells exactly once", () => {
  const s = freshState();
  assert.equal(acquireChip(s, "aegis"), true);
  assert.equal(acquireChip(s, "aegis"), false);
  assert.equal(s.stars, 30);
  salvageDrop(s, "neon", true, () => 0);
  assert.equal(sellSalvage(s), 28);
  assert.equal(sellSalvage(s), 0);
  assert.equal(s.stars, 58);
});
test("thirteen contracts point to reachable objects and completed chains unlock", () => {
  assert.equal(Object.keys(QUESTS).length, 13);
  const objects = Object.values(WORLDS).flatMap((w) => w.objects),
    s = freshState();
  for (const q of Object.values(QUESTS)) {
    assert.ok(objects.find((o) => o.id === q.giver));
    for (const g of q.goals) assert.ok(objects.find((o) => o.id === g.target));
    if (q.chip) assert.ok(CHIP_LIBRARY[q.chip]);
  }
  assert.equal(questsFor(s, "neon-mira").length, 1);
  s.flags["solved_neon-repair"] = true;
  assert.equal(questReady(s, QUESTS["neon-repair"]), true);
  s.flags["claimed_neon-repair"] = true;
  assert.equal(questsFor(s, "neon-mira").length, 2);
  s.flags.trackedQuest = "neon-blackout";
  assert.equal(trackedTarget(s), "neon-grid-north");
  s.flags["solved_neon-grid-north"] = s.flags["solved_neon-grid-south"] = true;
  assert.equal(trackedTarget(s), "neon-mira");
});
test("all six traders are real residents and three travel between districts", () => {
  const objects = Object.values(WORLDS).flatMap((w) => w.objects);
  assert.equal(Object.keys(TRADERS).length, 6);
  assert.equal(Object.values(TRADERS).filter((t) => t.wandering).length, 3);
  for (const [id, t] of Object.entries(TRADERS)) {
    const o = objects.find((o) => o.id === id);
    assert.ok(o.trader);
    assert.equal(!!o.wandering, !!t.wandering);
    for (const chip of t.stock) assert.ok(CHIP_LIBRARY[chip]);
  }
});
