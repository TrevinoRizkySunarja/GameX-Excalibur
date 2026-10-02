import { test, expect } from "@playwright/test";

async function open(page) {
  await page.addInitScript(() => {
    window.memorySequence = [];
    new MutationObserver((records) => {
      for (const r of records) {
        const b = r.target;
        if (r.type === "attributes" && b.matches?.("[data-memory].lit"))
          window.memorySequence.push(Number(b.dataset.memory));
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });
  await page.goto("/?debug=1");
  await expect(page.locator("#new-game")).toBeVisible();
}
async function solve(page) {
  await expect(page.locator("#minigame")).toBeVisible();
  if (await page.locator("#timing-stop").count()) {
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          const attempt = () => {
            const x = parseFloat(
              document.querySelector("#timing-needle")?.style.left,
            );
            if (x > 45 && x < 55) {
              document.querySelector("#timing-stop").click();
              resolve();
            } else requestAnimationFrame(attempt);
          };
          attempt();
        }),
    );
  } else if (await page.locator(".pulse-node").count()) {
    for (let i = 1; i <= 5; i++)
      await page
        .getByRole("button", { name: `Puls ${i}`, exact: true })
        .click();
  } else if (await page.locator("[data-memory]").count()) {
    await expect(page.locator("#memory-phase")).toContainText("Herhaal", {
      timeout: 8000,
    });
    const sequence = await page.evaluate(() => window.memorySequence);
    expect(sequence.length).toBeGreaterThan(2);
    for (const i of sequence)
      await page.locator(`[data-memory="${i}"]`).click();
  } else if (await page.locator("[data-left]").count()) {
    for (let i = 0; i < 3; i++) {
      await page.locator(`[data-left="${i}"]`).click();
      await page.locator(`[data-right="${i}"]`).click();
    }
  } else {
    const goal = await page.locator(".reaction-goal strong").textContent();
    await page
      .getByRole("button", {
        name: goal === "VUUR" ? "Hout + wrijving" : "Batterij + koperkabel",
        exact: true,
      })
      .click();
  }
  await page.evaluate(() => (window.memorySequence = []));
}
async function start(page) {
  await page.locator("#new-game").click();
  for (let i = 0; i < 3; i++) await page.locator("#story-next").click();
  await page.locator("#tool-tutorial").click();
  await solve(page);
  await page.locator("#dialogue-next").click();
  await page.locator("#dialogue-next").click();
  await expect(page.locator("#overlay")).toBeHidden();
}
async function interaction(page, id) {
  const hint = await page.evaluate((id) => {
    const g = window.__PROJECTX__,
      scene = g.engine.currentScene,
      o = scene.planet.objects.find((x) => x.id === id);
    scene.player.destination = null;
    scene.player.pos.x = o.x;
    scene.player.pos.y = o.y + 50;
    scene.player.vel.x = scene.player.vel.y = 0;
    return o.hint;
  }, id);
  await expect(page.locator("#prompt")).toBeVisible();
  await expect(page.locator("#prompt span")).toHaveText(hint);
  await page.keyboard.press("e");
}
async function boss(page, id) {
  await interaction(page, id);
  await expect(page.locator("#battle-hack")).toBeVisible();
  while (await page.locator("#battle-hack").count()) {
    await page.locator("#battle-hack").click();
    await solve(page);
    await expect(page.locator("#battle-hack, #win-continue")).toBeVisible({
      timeout: 5000,
    });
  }
  await page.locator("#win-continue").click();
}

test("title loads actual Excalibur scene and has no browser runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/title-desktop.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => window.__PROJECTX__.engine.currentScene.entities.length,
    ),
  ).toBeGreaterThan(10);
  expect(errors).toEqual([]);
});
test("each random minigame can succeed through its real UI", async ({
  page,
}) => {
  await open(page);
  for (const type of ["nodes", "timing", "wires", "logic", "memory"]) {
    await page.evaluate(async (type) => {
      const g = window.__PROJECTX__;
      g.modal('<div id="hack-body"></div>', "hack");
      window.hackResult = null;
      window.memorySequence = [];
      const { mountHack } = await import("/src/hacks.js");
      g.hackCleanup = mountHack(
        type,
        "kage",
        2,
        (ok) => (window.hackResult = ok),
      );
    }, type);
    await solve(page);
    await expect.poll(() => page.evaluate(() => window.hackResult)).toBe(true);
  }
});
test("movement, pause, proximity interaction and persistent loot work", async ({
  page,
}) => {
  await open(page);
  await start(page);
  const before = await page.evaluate(
    () => window.__PROJECTX__.engine.currentScene.player.pos.x,
  );
  await page.keyboard.down("d");
  await page.waitForTimeout(400);
  await page.keyboard.up("d");
  const after = await page.evaluate(
    () => window.__PROJECTX__.engine.currentScene.player.pos.x,
  );
  expect(after).toBeGreaterThan(before + 30);
  await page.keyboard.press("j");
  const pausedX = await page.evaluate(
    () => window.__PROJECTX__.engine.currentScene.player.pos.x,
  );
  await page.keyboard.down("d");
  await page.waitForTimeout(250);
  await page.keyboard.up("d");
  expect(
    await page.evaluate(
      () => window.__PROJECTX__.engine.currentScene.player.pos.x,
    ),
  ).toBeCloseTo(pausedX, 0);
  await page.keyboard.press("Escape");
  await interaction(page, "neon-cache");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.__PROJECTX__.state.collected.includes("neon-cache"),
      ),
    )
    .toBe(true);
  const stars = await page.evaluate(() => window.__PROJECTX__.state.stars);
  await page.reload();
  await page.locator("#resume").click();
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.interact(
      g.engine.currentScene.planet.objects.find((o) => o.id === "neon-cache"),
    );
  });
  expect(await page.evaluate(() => window.__PROJECTX__.state.stars)).toBe(
    stars,
  );
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/neon-exploration.png",
    fullPage: true,
  });
});
test("campaign: tutorial, chapter quests, choice, bosses, epilogue and postgame", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await start(page);
  await interaction(page, "ilo");
  await page.locator("#dialogue-next").click();
  await interaction(page, "neon-relay");
  await solve(page);
  await page.locator("#dialogue-next").click();
  await interaction(page, "neon-boss");
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/battle-neon.png",
    fullPage: true,
  });
  while (await page.locator("#battle-hack").count()) {
    await page.locator("#battle-hack").click();
    await solve(page);
    await expect(page.locator("#battle-hack, #win-continue")).toBeVisible();
  }
  await page.locator("#win-continue").click();
  await page.keyboard.press("m");
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/destinations.png",
    fullPage: true,
  });
  await page.locator('[data-destination="kage"]').click();
  await page.locator("#dialogue-next").click();
  await interaction(page, "ren");
  await page.locator("#dialogue-next").click();
  await interaction(page, "kage-anchor");
  await solve(page);
  await page.locator("#overload-anchor").click();
  await page.locator("#dialogue-next").click();
  await boss(page, "kage-boss");
  await page.keyboard.press("m");
  await page.locator('[data-destination="citadel"]').click();
  await page.locator("#dialogue-next").click();
  await interaction(page, "citadel-core");
  await solve(page);
  await page.locator("#dialogue-next").click();
  await boss(page, "citadel-boss");
  for (let i = 0; i < 3; i++) await page.locator("#ending-next").click();
  await page.locator("#dialogue-next").click();
  await expect(page.locator('[data-destination="neon"]')).toBeEnabled();
  expect(
    await page.evaluate(() => window.__PROJECTX__.state.flags.campaignDone),
  ).toBe(true);
  expect(
    await page.evaluate(() => window.__PROJECTX__.state.defeated.length),
  ).toBe(3);
  expect(errors).toEqual([]);
});
test("failure deals damage, retreat preserves loot and a defeated encounter cannot pay twice", async ({
  page,
}) => {
  await open(page);
  await start(page);
  await page.evaluate(() => {
    window.__PROJECTX__.state.lastHack = "timing";
    Math.random = () => 0.99;
  });
  await interaction(page, "neon-drone");
  await page.locator("#battle-hack").click();
  const goal = await page.locator(".reaction-goal strong").textContent();
  await page
    .getByRole("button", {
      name: goal === "VUUR" ? "Water + zand" : "Hout + glas",
      exact: true,
    })
    .click();
  await expect(page.locator("#battle-hack")).toBeVisible();
  expect(await page.evaluate(() => window.__PROJECTX__.state.hp)).toBe(90);
  await page.locator("#battle-flee").click();
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.state.defeated.push("neon-drone");
    g.save();
  });
  const stars = await page.evaluate(() => window.__PROJECTX__.state.stars);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.interact(
      g.engine.currentScene.planet.objects.find((o) => o.id === "neon-drone"),
    );
  });
  expect(await page.evaluate(() => window.__PROJECTX__.state.stars)).toBe(
    stars,
  );
  await expect(page.locator("#overlay")).toBeHidden();
});
test("narrow screen title and hack UI fit without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/title-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.evaluate(async () => {
    const g = window.__PROJECTX__;
    g.modal('<div id="hack-body"></div>', "hack");
    const { mountHack } = await import("/src/hacks.js");
    g.hackCleanup = mountHack("wires", "neon", 1, () => {});
  });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/hack-mobile.png",
    fullPage: true,
  });
  await solve(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("shop upgrades, insufficient funds and the restore choice work", async ({
  page,
}) => {
  await open(page);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    Object.assign(g.state, {
      started: true,
      tool: true,
      stars: 120,
      bolts: 16,
      hp: 40,
    });
    g.shop();
  });
  await page.locator("#buy-chip").click();
  await page.locator("#buy-chip").click();
  await page.locator("#buy-chip").click();
  await expect(page.locator("#toast")).toContainText("meer Stars");
  expect(await page.evaluate(() => window.__PROJECTX__.state.chips)).toBe(2);
  await page.locator("#buy-hardware").click();
  await page.locator("#buy-hardware").click();
  expect(
    await page.evaluate(() => window.__PROJECTX__.state.flags.hardwareUpgrade),
  ).toBe(2);
  expect(await page.evaluate(() => window.__PROJECTX__.state.bolts)).toBe(0);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.state.stars = 15;
    g.shop();
  });
  await page.locator("#buy-heal").click();
  expect(await page.evaluate(() => window.__PROJECTX__.state.hp)).toBe(100);
  await page.locator("#close-modal").click();
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    Object.assign(g.state.flags, {
      neonBoss: true,
      kageTalk: true,
      kageAnchor: true,
    });
    g.destinations();
  });
  await page.locator('[data-destination="kage"]').click();
  await page.locator("#dialogue-next").click();
  await interaction(page, "kage-anchor");
  await page.locator("#restore-anchor").click();
  await page.locator("#dialogue-next").click();
  await interaction(page, "kage-boss");
  await expect(page.locator(".enemy-stats")).toContainText("125 / 125 HP");
  expect(
    await page.evaluate(() => window.__PROJECTX__.state.flags.kageChoice),
  ).toBe("restore");
});
