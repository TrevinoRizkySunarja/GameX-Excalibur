import test from "node:test";
import assert from "node:assert/strict";
import {
  freshState,
  readSave,
  writeSave,
  grant,
  purchase,
  pickHack,
  damageFor,
  record,
  SAVE_KEY,
} from "../src/state.js";
import {
  WORLDS,
  DESTINATIONS,
  MINIGAMES,
  availableDestinations,
  missionFor,
  targetFor,
} from "../src/data.js";

const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k), setItem: (k, v) => data.set(k, v) };
};
test("new players start with only NEON unlocked and the NPC as their objective", () => {
  const state = freshState();
  assert.deepEqual(availableDestinations(state), ["neon"]);
  assert.equal(targetFor(state, "neon"), "ilo");
  assert.match(missionFor(state, "neon"), /Ilo/);
  assert.equal(state.tool, false);
});
test("chapter objectives progress and coördinates unlock only after a boss", () => {
  const state = freshState();
  state.flags.neonTalk = true;
  assert.equal(targetFor(state, "neon"), "neon-relay");
  state.flags.neonRelay = true;
  assert.equal(targetFor(state, "neon"), "neon-boss");
  assert.deepEqual(availableDestinations(state), ["neon"]);
  state.flags.neonBoss = true;
  assert.deepEqual(availableDestinations(state), ["neon", "kage"]);
  state.flags.kageTalk = true;
  assert.equal(targetFor(state, "kage"), "kage-anchor");
  state.flags.kageAnchor = true;
  assert.equal(targetFor(state, "kage"), "kage-anchor");
  state.flags.kageChoice = "restore";
  assert.equal(targetFor(state, "kage"), "kage-boss");
  state.flags.kageBoss = true;
  assert.deepEqual(availableDestinations(state), ["neon", "kage", "citadel"]);
  state.flags.citadelCore = true;
  assert.equal(targetFor(state, "citadel"), "citadel-boss");
  state.flags.finalBoss = true;
  assert.match(missionFor(state, "citadel"), /Vrije verkenning/);
});
test("save and reload retain quests, currencies, choice and collected loot", () => {
  const store = memoryStorage(),
    state = freshState();
  state.started = state.tool = true;
  state.flags.kageChoice = "overload";
  state.collected.push("neon-cache");
  state.defeated.push("neon-boss");
  grant(state, { stars: 57, bolts: 9, chips: 1 });
  assert.equal(writeSave(state, store), true);
  assert.deepEqual(readSave(store), state);
});
test("corrupt, outdated or blocked storage does not prevent a new game", () => {
  for (const text of [
    "{oops",
    "null",
    '{"version":0}',
    '{"version":1,"flags":null,"collected":[],"defeated":[]}',
  ])
    assert.deepEqual(readSave({ getItem: () => text }), freshState());
  assert.deepEqual(
    readSave({
      getItem() {
        throw Error("blocked");
      },
    }),
    freshState(),
  );
  assert.equal(
    writeSave(freshState(), {
      setItem() {
        throw Error("blocked");
      },
    }),
    false,
  );
});
test("save validation normalizes unsafe numbers and unknown worlds", () => {
  const store = memoryStorage();
  store.setItem(
    SAVE_KEY,
    JSON.stringify({
      ...freshState(),
      stars: -9,
      bolts: "4",
      chips: 99,
      hp: 900,
      world: "missing",
      log: null,
    }),
  );
  const state = readSave(store);
  assert.equal(state.stars, 0);
  assert.equal(state.bolts, 4);
  assert.equal(state.chips, 3);
  assert.equal(state.hp, 100);
  assert.equal(state.world, "neon");
  assert.deepEqual(state.log, []);
});
test("shop spends Stars once and rejects unaffordable purchases", () => {
  const state = freshState();
  grant(state, { stars: 60 });
  assert.equal(
    purchase(state, 60, (s) => s.chips++),
    true,
  );
  assert.equal(state.chips, 1);
  assert.equal(state.stars, 0);
  assert.equal(
    purchase(state, 60, (s) => s.chips++),
    false,
  );
  assert.equal(state.chips, 1);
});
test("random hacks are available on every planet and avoid immediate repeats", () => {
  const state = freshState();
  const first = pickHack(state, MINIGAMES, () => 0);
  const second = pickHack(state, MINIGAMES, () => 0);
  assert.notEqual(first, second);
  for (const world of Object.keys(WORLDS)) {
    state.world = world;
    for (const rng of [0, 0.22, 0.48, 0.75, 0.999])
      assert.ok(MINIGAMES.includes(pickHack(state, MINIGAMES, () => rng)));
  }
  assert.equal(
    pickHack(state, ["timing"], () => 0),
    "timing",
  );
  assert.equal(
    pickHack(state, ["timing"], () => 0),
    "timing",
  );
  assert.throws(() => pickHack(state, [], () => 0));
});
test("software upgrades strengthen damage, with a finite cap", () => {
  const state = freshState();
  assert.equal(damageFor(state), 25);
  state.chips = 1;
  assert.equal(damageFor(state), 30);
  state.chips = 3;
  assert.equal(damageFor(state), 40);
  state.chips = 100;
  assert.equal(damageFor(state), 40);
});
test("logbook deduplicates discoveries and limits stored history", () => {
  const state = freshState();
  record(state, "Ilo");
  record(state, "Ilo");
  assert.equal(state.log.length, 1);
  for (let i = 0; i < 40; i++) record(state, `Quest ${i}`);
  assert.equal(state.log.length, 30);
  assert.equal(state.log[0], "Quest 39");
});
test("destination map includes 12 destinations, exactly one station and 3 playable chapters", () => {
  assert.equal(DESTINATIONS.length, 12);
  assert.equal(
    DESTINATIONS.filter((d) => d.name.includes("STATION")).length,
    1,
  );
  assert.equal(DESTINATIONS.filter((d) => !d.planned).length, 3);
  const ids = Object.values(WORLDS).flatMap((w) => w.objects.map((o) => o.id));
  assert.equal(new Set(ids).size, ids.length);
});
test("all chapter objectives reference real world objects and a ship remains reachable", () => {
  for (const [id, world] of Object.entries(WORLDS)) {
    assert.ok(world.objects.some((o) => o.type === "ship"));
    assert.ok(world.objects.some((o) => o.type === "boss"));
    assert.ok(world.objects.some((o) => o.type === "secret"));
    assert.ok(world.objects.some((o) => o.id === targetFor(freshState(), id)));
  }
});
