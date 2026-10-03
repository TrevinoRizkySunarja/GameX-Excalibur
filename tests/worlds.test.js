import test from "node:test";
import assert from "node:assert/strict";
import { WORLDS, MINIGAMES } from "../src/data.js";
import { walkable, routeTo, SIDE_QUESTS } from "../src/levels.js";
import { HACKS, CHESS_PUZZLES, isQueenMate } from "../src/hack-catalog.js";
test("all sixteen random hacks have instructions and a time budget", () => {
  assert.equal(MINIGAMES.length, 16);
  assert.deepEqual(new Set(MINIGAMES), new Set(Object.keys(HACKS)));
  for (const v of Object.values(HACKS)) assert.ok(v[3] >= 20);
});
test("curated chess positions offer real mate in one and reject an unmoved queen", () => {
  for (const p of CHESS_PUZZLES) {
    assert.equal(isQueenMate(p, p.mate), true);
    assert.equal(isQueenMate(p, p.queen), false);
    assert.equal(isQueenMate(p, p.king), false);
    assert.equal(isQueenMate(p, p.enemy), false);
  }
});
test("every mission, reward and citizen is reachable from the landing zone", () => {
  for (const world of Object.values(WORLDS)) {
    const start = { x: world.spawn[0], y: world.spawn[1] };
    assert.ok(world.width * world.height > 4 * 1440 * 1040);
    for (const obj of world.objects) {
      assert.ok(
        walkable(world, obj.x, obj.y, 8),
        `${obj.id} is off walkable ground`,
      );
      assert.ok(routeTo(world, start, obj).length, `${obj.id} is disconnected`);
      for (const [x, y] of obj.route || [])
        assert.ok(
          walkable(world, x, y, 5),
          `${obj.id} route is outside ground`,
        );
    }
  }
});
test("map walls and canal water block travel, while bridge decks permit it", () => {
  const w = WORLDS.neon;
  assert.equal(walkable(w, 1400, 1340, 8), false);
  assert.equal(walkable(w, 1400, 1580, 8), true);
  assert.equal(walkable(w, 100, 100, 8), false);
});
test("sidequests have a real terminal and a unique living quest giver", () => {
  for (const [id, q] of Object.entries(SIDE_QUESTS)) {
    const all = Object.values(WORLDS).flatMap((w) => w.objects);
    assert.equal(
      all.filter((o) => o.id === id && o.type === "sidehack").length,
      1,
    );
    assert.equal(all.filter((o) => o.quest === id).length, 1);
    assert.ok(q.reward > 0);
  }
});
