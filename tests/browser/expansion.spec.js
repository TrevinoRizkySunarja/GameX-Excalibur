import { test, expect } from "@playwright/test";
import { solveExtra } from "./solve-extra.js";
async function boot(page) {
  await page.goto("/?debug=1");await expect(page.locator("#new-game")).toBeVisible();
  const readyFrame=await page.evaluate(()=>window.__PROJECTX__.engine.stats.currFrame.id);
  await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.engine.stats.currFrame.id),{timeout:60000}).toBeGreaterThan(readyFrame+2);
  await page.evaluate(()=>{const g=window.__PROJECTX__;g.state.started=g.state.tool=true;g.state.chips=3;g.state.lastHack=null;Math.random=()=>0;g.close();});
}
async function talk(page) {
  await expect(page.locator("#dialogue-next")).toBeVisible();
  for(let i=0;i<15 && await page.locator("#dialogue-next").count();i++) await page.locator("#dialogue-next").click();
}
async function interact(page,id) {
  await page.evaluate(id=>{const g=window.__PROJECTX__,s=g.engine.currentScene,a=s.worldActors.get(id);s.player.pos.x=a.pos.x;s.player.pos.y=a.pos.y+20;s.player.path=[];s.player.destination=null;s.player.vel.x=s.player.vel.y=0;},id);
  // A teleport can expose fresh floor textures in software-rendered Chromium.
  await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.engine.currentScene.nearest?.id),{timeout:30000}).toBe(id);
  await expect(page.locator("#prompt")).toBeVisible();await page.keyboard.press("e");
}
async function quick(page) {
  await expect(page.locator("#minigame")).toBeVisible();
  if(await page.locator("#timing-stop").count()) await page.evaluate(()=>new Promise(resolve=>{
    const tick=()=>{const n=document.querySelector("#timing-needle");if(!n){resolve();return;}const x=parseFloat(n.style.left);if(x>46&&x<54){document.querySelector("#timing-stop").click();resolve();}else requestAnimationFrame(tick);};tick();
  }));
  else for(let i=1;i<=5;i++) await page.locator(`.pulse-node`).filter({hasText:new RegExp(`^${i}$`)}).click();
}
async function fight(page,id) {
  await interact(page,id);
  await expect(page.locator("#dialogue-next,#battle-hack")).toBeVisible();
  if(await page.locator("#dialogue-next").count())await talk(page);
  await expect(page.locator("#battle-hack")).toBeVisible();
  for(let n=0;n<20 && await page.locator("#battle-hack").count();n++) {
    await page.locator("#battle-hack").click();await quick(page);await expect(page.locator("#battle-hack,#win-continue")).toBeVisible();
  }
  await expect(page.locator("#win-continue")).toBeVisible();await page.locator("#win-continue").click();
}
async function hackObject(page,id) {await interact(page,id);await quick(page);await talk(page);}
async function planet(page,world) {
  await page.evaluate(async world=>{const g=window.__PROJECTX__;g.state.flags.neonBoss=true;g.state.flags[`visited_${world}`]=true;await g.travel(world);},world);
  await expect(page.locator("#overlay")).toBeHidden({timeout:30000});
}

test("new multi-speaker quests grant real upgrades only at the final beat, and preserve transcripts",async({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));await boot(page);
  await interact(page,"neon-nyx");await page.locator("#cinema-subtitle").click();
  await expect(page.locator(".cinema-stage")).toHaveAttribute("data-speaker","nyx");
  await expect.poll(()=>page.locator(".cinema-actor .mouth-closed").evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.screenshot({path:"test-results/nyx-story.png",fullPage:true});
  await page.locator("#dialogue-next").click();
  await expect(page.locator(".cinema-stage")).toHaveAttribute("data-speaker","hero");
  expect(await page.evaluate(()=>!!window.__PROJECTX__.state.flags["accepted_neon-nyx-1"])).toBe(false);
  await page.locator("#conversation-log").click();await expect(page.locator(".dialogue-history")).toContainText("Nyx");await page.locator("#back-conversation").click();await talk(page);
  expect(await page.evaluate(()=>window.__PROJECTX__.state.flags["accepted_neon-nyx-1"])).toBe(true);
  await hackObject(page,"neon-nyx-relay");await fight(page,"neon-choir-gang");
  await interact(page,"neon-nyx");await talk(page);
  expect(await page.evaluate(()=>window.__PROJECTX__.state.ownedChips.includes("nullthread"))).toBe(true);
  await page.keyboard.press("i");await page.locator('[data-equip-chip="nullthread"]').click();await page.keyboard.press("Escape");
  await page.reload();await page.locator("#resume").click();await page.keyboard.press("j");
  await expect(page.locator(".quest-entry.complete")).toContainText("Wie spreekt er in de ruis?");
  await page.locator("#journal-transcript").click();await expect(page.locator(".dialogue-history")).toContainText("Mijn zus");expect(errors).toEqual([]);
});

test("all four dungeons enforce keys, bosses, supply limits, rare treasure and one-time rewards",async({page})=>{
  test.setTimeout(480000);const errors=[];page.on("pageerror",e=>errors.push(e.message));await boot(page);
  for(const [id,world,entry,chip,rarity] of [["blackline","neon","neon-blackline-entry","voltpsalm","Legendary"],["prism","neon","neon-prism-entry","prismheart","Exotic"],["bell","kage","kage-bell-entry","bellguard","Legendary"],["moon","kage","kage-moon-entry","eclipse","Exotic"]]) {
    await planet(page,world);await interact(page,entry);await page.locator("#enter-dungeon").click();await talk(page);
    expect(await page.evaluate(()=>window.__PROJECTX__.dungeon)).toBe(id);
    await interact(page,`${id}-boss`);await expect(page.locator("#toast")).toContainText("verzegeld");
    await interact(page,`${id}-vault`);await expect(page.locator("#toast")).toContainText("gesloten");
    await page.evaluate(()=>{const g=window.__PROJECTX__;g.state.hp=50;g.refresh();});
    await interact(page,`${id}-supply`);await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.state.hp)).toBe(90);
    await fight(page,`${id}-guard`);await hackObject(page,`${id}-seal-a`);await hackObject(page,`${id}-seal-b`);
    // Boss intros, phase II and every hack are exercised through real controls.
    await fight(page,`${id}-boss`);await interact(page,`${id}-vault`);
    await expect(page.locator(".relic-reveal")).toHaveAttribute("data-rarity",rarity.toLowerCase());
    expect(await page.evaluate(chip=>window.__PROJECTX__.state.ownedChips.includes(chip),chip)).toBe(true);
    await page.screenshot({path:`test-results/${id}-treasure.png`,fullPage:true});await page.locator("#relic-close").click();
    const stars=await page.evaluate(()=>window.__PROJECTX__.state.stars);
    await page.evaluate(id=>{const g=window.__PROJECTX__;g.interact(g.engine.currentScene.planet.objects.find(o=>o.id===`${id}-vault`));},id);
    expect(await page.evaluate(()=>window.__PROJECTX__.state.stars)).toBe(stars);
    await interact(page,`${id}-exit`);
    await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.dungeon)).toBe(null);
    await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.engine.currentScene.id)).toBe(world);
    await expect(page.locator("#overlay")).toBeHidden();
    expect(await page.evaluate(id=>window.__PROJECTX__.state.collected.includes(`${id}-supply`),id)).toBe(true);
  }
  await page.reload();await page.locator("#resume").click();
  expect(await page.evaluate(()=>window.__PROJECTX__.state.ownedChips.filter(c=>["voltpsalm","prismheart","bellguard","eclipse"].includes(c)).length)).toBe(4);
  expect(errors).toEqual([]);
});

test("secret clues, roaming district residents, travel beacons and overworld bosses give persistent loot",async({page})=>{
  test.setTimeout(240000);await boot(page);
  for(const [world,boss,chip] of [["neon","neon-arcwarden","stormheart"],["kage","kage-nine-tail","kitsune"]]) {
    await planet(page,world);
    if(world==="neon") {
      // An adjacent beacon must not steal a click intended for a resident.
      await page.evaluate(()=>{const s=window.__PROJECTX__.engine.currentScene,a=s.worldActors.get("neon-crowd-0"),b=s.worldActors.get("neon-beacon-0");a.pos.x=b.pos.x+40;a.pos.y=b.pos.y;s.player.pos.x=a.pos.x;s.player.pos.y=a.pos.y+20;});
      await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.engine.currentScene.nearest?.id),{timeout:30000}).toBe("neon-crowd-0");
      const point=await page.evaluate(()=>{const g=window.__PROJECTX__,p=g.engine.screen.worldToPageCoordinates(g.engine.currentScene.worldActors.get("neon-crowd-0").pos);return{x:p.x,y:p.y};});
      await page.mouse.click(point.x,point.y);await expect(page.locator("#toast")).toContainText("Lio");await expect(page.locator("#overlay")).toBeHidden();
    }
    await interact(page,`${world}-secret-relic`);await expect(page.locator("#toast")).toContainText(world==="neon"?"Nyx":"Sumi");
    await page.keyboard.press("l");expect(await page.locator('[data-map-object$="secret-relic"]').count()).toBe(0);await page.keyboard.press("Escape");
    await hackObject(page,`${world}-secret-switch-a`);await hackObject(page,`${world}-secret-switch-b`);
    await interact(page,`${world}-secret-relic`);await expect(page.locator(".relic-reveal")).toBeVisible();await page.locator("#relic-close").click();
    await fight(page,boss);expect(await page.evaluate(chip=>window.__PROJECTX__.state.ownedChips.includes(chip),chip)).toBe(true);
    await interact(page,`${world}-beacon-dock`);await expect(page.locator(`[data-jump-beacon="${world}-beacon-0"]`)).toBeDisabled();await page.keyboard.press("Escape");
    await interact(page,`${world}-beacon-0`);await page.locator(`[data-jump-beacon="${world}-beacon-dock"]`).click();
    expect(await page.evaluate(world=>window.__PROJECTX__.engine.currentScene.player.pos.distance(window.__PROJECTX__.engine.currentScene.worldActors.get(`${world}-beacon-dock`).pos),world)).toBeLessThan(10);
  }
  await page.reload();await page.locator("#resume").click();expect(await page.evaluate(()=>window.__PROJECTX__.state.ownedChips.includes("kitsune"))).toBe(true);
});

test("planet themes cover menus and new hacks; audio and readable subtitles persist on narrow screens",async({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));await boot(page);
  await page.keyboard.press("p");await page.locator("#music-volume").fill("0.2");await page.locator("#music-volume").dispatchEvent("input");
  await page.locator("#effects-volume").fill("0.4");await page.locator("#effects-volume").dispatchEvent("input");
  await page.locator("#subtitle-speed").selectOption("instant");await page.locator("#large-subtitles").check();await page.locator("#reduced-effects").check();
  await page.keyboard.press("Escape");await page.locator("#nav-sound").click();expect(await page.evaluate(()=>window.__PROJECTX__.soundStatus().enabled)).toBe(false);await page.locator("#nav-sound").click();
  await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.soundStatus().context)).toBe("running");
  await expect.poll(()=>page.evaluate(()=>window.__PROJECTX__.soundStatus().notesPlayed)).toBeGreaterThan(0);
  await planet(page,"kage");
  await interact(page,"kage-moon-entry");await page.locator("#enter-dungeon").click();await talk(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
  await page.evaluate(async()=>window.__PROJECTX__.exitDungeon());await expect(page.locator("#overlay")).toBeHidden({timeout:30000});
  await page.keyboard.press("i");await expect(page.locator("html")).toHaveAttribute("data-theme","kage");
  await page.screenshot({path:"test-results/kage-themed-loadout.png",fullPage:true});await page.keyboard.press("Escape");
  await page.setViewportSize({width:390,height:844});
  for(const type of ["fingerprint","decoder","fuses","mirrors"]) {
    await page.evaluate(async type=>{const g=window.__PROJECTX__;g.modal('<div id="hack-body"></div>',"hack");window.hackOK=null;g.hackCleanup=g.launchHack(type,"kage",2,ok=>window.hackOK=ok);},type);
    await solveExtra(page,type);expect(await page.evaluate(()=>window.hackOK)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await page.evaluate(()=>window.__PROJECTX__.close());await interact(page,"kage-akari");await expect(page.locator("#subtitle-text")).toContainText("Een zwaard onthoudt");
  await page.screenshot({path:"test-results/kage-akari-mobile.png",fullPage:true});await talk(page);
  await page.reload();await page.locator("#resume").click();await page.keyboard.press("p");await expect(page.locator("#subtitle-speed")).toHaveValue("instant");await expect(page.locator("#reduced-effects")).toBeChecked();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);expect(errors).toEqual([]);
});
