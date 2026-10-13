import test from "node:test";
import assert from "node:assert/strict";
import { WORLDS } from "../src/data.js";
import { DUNGEONS, dungeonGoals, requirementsMet } from "../src/expansion.js";
import { walkable, routeTo } from "../src/levels.js";
import { freshState, writeSave, readSave } from "../src/state.js";
import { createBattle, resolveBattleHack, battleWon } from "../src/encounters.js";
import { CHIP_LIBRARY, acquireChip, toggleChip, chipStats } from "../src/progression.js";
import { traceLaser, safeFuse } from "../src/advanced-hacks.js";

test("four dungeons are connected, their keys precede bosses, and vaults require a victory", () => {
  for (const d of Object.values(DUNGEONS)) {
    const s=freshState();
    const boss=d.objects.find(o=>o.id===d.boss), vault=d.objects.find(o=>o.id===`${d.id}-vault`);
    assert.equal(requirementsMet(s,boss),false);
    for(const id of d.gates)s.flags[`solved_${id}`]=true;
    assert.equal(requirementsMet(s,boss),false);
    s.defeated.push(d.guard); assert.equal(requirementsMet(s,boss),true);
    assert.equal(requirementsMet(s,vault),false);
    s.defeated.push(boss.id); assert.equal(requirementsMet(s,vault),true);
    s.collected.push(vault.id);assert.ok(dungeonGoals(s,d).every(g=>g.done));
    for(const o of d.objects){ assert.ok(walkable(d,o.x,o.y,8),o.id); assert.ok(routeTo(d,{x:d.spawn[0],y:d.spawn[1]},o).length,o.id); }
    assert.ok(["Legendary","Exotic"].includes(CHIP_LIBRARY[vault.chip].rarity));
    assert.ok(!CHIP_LIBRARY[vault.chip].price, "dungeon treasure is earned, not sold");
  }
});
test("secrets require both hidden transmitters and their collected chips survive reload",()=>{
  for(const w of [WORLDS.neon,WORLDS.kage]) {
    const s=freshState(), relic=w.objects.find(o=>o.hidden&&o.type==="relic");
    assert.equal(requirementsMet(s,relic),false);
    s.flags[`solved_${relic.requiresSolved[0]}`]=true;assert.equal(requirementsMet(s,relic),false);
    s.flags[`solved_${relic.requiresSolved[1]}`]=true;assert.equal(requirementsMet(s,relic),true);
    s.collected.push(relic.id);acquireChip(s,relic.chip);toggleChip(s,relic.chip);
    let json; const storage={getItem:()=>json,setItem:(_,v)=>json=v};writeSave(s,storage);
    const restored=readSave(storage);assert.ok(restored.collected.includes(relic.id));assert.ok(restored.equippedChips.includes(relic.chip));assert.deepEqual(chipStats(restored),chipStats(s));
  }
});
test("boss phase changes occur at half health; regeneration, armour and counters have different effects",()=>{
  for(const id of ["blackline","prism","bell","moon"]) {
    const s=freshState(), b=createBattle(DUNGEONS[id].objects.find(o=>o.type==="boss"),s);
    let changed=0;
    while(!b.phaseActive&&!battleWon(b)){ const r=resolveBattleHack(b,s,true);changed+=r.phaseChanged?1:0; }
    assert.equal(changed,1); const hp=b.currentHp;
    const hit=resolveBattleHack(b,s,false);
    if(id==="prism"){assert.equal(b.currentHp,hp+10);assert.equal(hit.damage,18);}
    else if(id==="bell"){assert.equal(hit.damage,18);assert.equal(resolveBattleHack(b,s,true).damage,22);}
    else assert.equal(hit.damage,22);
  }
});
test("laser tracing has a real unique path and validates only safe fuse sizes",()=>{
  const solutions=[];
  for(let n=0;n<16;n++){const rotations=Array.from({length:4},(_,i)=>(n>>i)&1);if(traceLaser(rotations).hit)solutions.push(rotations);}
  assert.deepEqual(solutions,[[0,0,1,1]]);
  assert.equal(safeFuse(5,4),true);assert.equal(safeFuse(10,4),false);assert.equal(safeFuse(5,7),false);assert.equal(safeFuse(10,7),true);assert.equal(safeFuse(15,12),true);
});
