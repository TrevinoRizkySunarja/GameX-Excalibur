import { test, expect } from "@playwright/test";
import fs from "node:fs";

async function boot(page) {
  await page.goto("/?debug=1");
  await expect(page.locator("#new-game")).toBeVisible();
}
async function solveQuick(page) {
  await expect(page.locator("#minigame")).toBeVisible();
  if (await page.locator("#timing-stop").count()) {
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          const tick = () => {
            const x = parseFloat(
              document.querySelector("#timing-needle")?.style.left,
            );
            if (x > 46 && x < 54) {
              document.querySelector("#timing-stop").click();
              resolve();
            } else requestAnimationFrame(tick);
          };
          tick();
        }),
    );
  } else
    for (let i = 1; i <= 5; i++)
      await page
        .getByRole("button", { name: `Puls ${i}`, exact: true })
        .click();
}
test("six illustrated prologue scenes load and speaking mouths stop when text is revealed", async ({
  page,
}) => {
  await boot(page);
  await page.locator("#new-game").click();
  await expect(page.locator(".cinema-stage")).toHaveAttribute(
    "data-speaker",
    "mother",
  );
  await page.waitForFunction(() => {
    const mouth = document.querySelector(".speaking .mouth-open");
    return mouth && getComputedStyle(mouth).display === "block";
  });
  await page.locator("#cinema-subtitle").click();
  await page.screenshot({
    path: "test-results/manga-prologue.png",
    fullPage: true,
  });
  await expect(page.locator(".cinema-stage")).not.toHaveClass(/speaking/);
  for (let i = 1; i <= 6; i++) {
    await expect(page.locator(".cinema-image")).toHaveAttribute(
      "src",
      new RegExp(`prologue-${i}\\.webp$`),
    );
    await expect
      .poll(() =>
        page
          .locator(".cinema-image")
          .evaluate((e) => e.complete && e.naturalWidth > 0),
      )
      .toBe(true);
    if (i === 4)
      await expect(page.locator(".cinema-faction")).toContainText(
        "De Gebroken Zon",
      );
    await page.locator("#story-next").click();
  }
  await expect(page.locator("#tool-tutorial")).toBeVisible();
  await page.locator("#ship-memories").click();
  await expect(page.locator("#story-next")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator(".cinema-subtitle")).toContainText(
    "Dat beloof ik.",
  );
  await expect(page.locator(".cinema-image")).toHaveAttribute(
    "src",
    /prologue-1\.webp$/,
  );
  await page.keyboard.press("Enter");
  await expect(page.locator(".cinema-image")).toHaveAttribute(
    "src",
    /prologue-2\.webp$/,
  );
  await page.locator("#skip-story").click();
  await expect(page.locator("#tool-tutorial")).toBeVisible();
});
test("a gang transition freezes exploration; target selection, failure, full victory and persistent loot work", async ({
  page,
}) => {
  await boot(page);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.state.started = g.state.tool = true;
    g.state.chips = 3;
    g.close();
    g.state.lastHack = null;
    Math.random = () => 0;
    g.startBattle(
      g.engine.currentScene.planet.objects.find((o) => o.id === "neon-drone-2"),
    );
  });
  await expect(page.locator(".encounter-wipe")).toBeVisible();
  expect(await page.evaluate(() => window.__PROJECTX__.paused)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.locator(".gang-member")).toHaveCount(3);
  await page.screenshot({
    path: "test-results/gang-battle.png",
    fullPage: true,
  });
  await page.locator('[data-enemy-target="1"]').click();
  await page.locator("#battle-hack").click();
  expect(await page.locator(".gang-member:disabled").count()).toBe(3);
  // Deliberately stop outside the safe window, using the real button.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        const tick = () => {
          const x = parseFloat(
            document.querySelector("#timing-needle").style.left,
          );
          if (x > 90) {
            document.querySelector("#timing-stop").click();
            resolve();
          } else requestAnimationFrame(tick);
        };
        tick();
      }),
  );
  await expect(page.locator("#battle-hack")).toBeVisible();
  expect(await page.evaluate(() => window.__PROJECTX__.state.hp)).toBe(86);
  await page.locator("#battle-hack").click();
  await solveQuick(page);
  await expect(page.locator("#battle-hack")).toBeVisible();
  await expect(page.locator('[data-enemy-target="1"]')).toBeDisabled();
  expect(
    await page.evaluate(() =>
      window.__PROJECTX__.state.defeated.includes("neon-drone-2"),
    ),
  ).toBe(false);
  for (let i = 0; i < 5 && (await page.locator("#battle-hack").count()); i++) {
    await page.locator("#battle-hack").click();
    await solveQuick(page);
    await expect(page.locator("#battle-hack, #win-continue")).toBeVisible();
  }
  await expect(page.locator("#win-continue")).toBeVisible();
  expect(await page.evaluate(() => window.__PROJECTX__.state.stars)).toBe(34);
  expect(await page.evaluate(() => window.__PROJECTX__.state.bolts)).toBe(4);
  await page.locator("#win-continue").click();
  await page.reload();
  await page.locator("#resume").click();
  expect(
    await page.evaluate(() =>
      window.__PROJECTX__.state.defeated.includes("neon-drone-2"),
    ),
  ).toBe(true);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.interact(
      g.engine.currentScene.planet.objects.find((o) => o.id === "neon-drone-2"),
    );
  });
  expect(await page.evaluate(() => window.__PROJECTX__.state.stars)).toBe(34);
});
test("important sidequest people have cinematic dialogue and KAGE uses the authored map in navigation", async ({
  page,
}) => {
  await boot(page);
  await page.evaluate(async () => {
    const g = window.__PROJECTX__;
    g.state.started = g.state.tool = true;
    g.state.world = "kage";
    g.state.flags.neonBoss = true;
    await g.engine.goToScene("kage");
    g.close();
    g.npc(
      g.engine.currentScene.planet.objects.find((o) => o.id === "kage-hana"),
    );
  });
  await expect(page.locator(".cinema-stage")).toHaveAttribute(
    "data-speaker",
    "hana",
  );
  await expect(page.locator(".cinema-image")).toHaveAttribute(
    "src",
    /chapter-5\.webp$/,
  );
  await page.locator("#cinema-subtitle").click();
  await page.screenshot({
    path: "test-results/kage-hana-cutscene.png",
    fullPage: true,
  });
  await expect(page.locator(".cinema-subtitle")).toContainText("laatste zaden");
  await page.locator("#dialogue-next").click();
  expect(
    await page.evaluate(
      () => window.__PROJECTX__.state.flags["accepted_kage-water"],
    ),
  ).toBe(true);
  await page.keyboard.press("l");
  await expect(page.locator(".local-map img")).toHaveAttribute(
    "src",
    /^data:image\/webp/,
  );
  await page.locator('[data-map-object="ren"]').click();
  expect(
    await page.evaluate(
      () => window.__PROJECTX__.engine.currentScene.player.path.length,
    ),
  ).toBeGreaterThan(0);
  for (const id of ["neon", "kage", "citadel"]) {
    const data = await page.evaluate(async (id) => {
      const { worldMapCanvas } = await import("/src/world-renderer.js");
      const { WORLDS } = await import("/src/data.js");
      return worldMapCanvas(WORLDS[id]).toDataURL("image/png");
    }, id);
    fs.writeFileSync(
      `test-results/${id}-authored-map.png`,
      Buffer.from(data.split(",")[1], "base64"),
    );
  }
});
test("narrow manga subtitles and gang controls fit; reduced motion completes the transition", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await boot(page);
  await page.locator("#new-game").click();
  await expect(page.locator(".cinema-subtitle")).toContainText(
    "Luister naar me",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.evaluate(() => {
    const g = window.__PROJECTX__;
    g.state.started = g.state.tool = true;
    g.close();
    g.startBattle(
      g.engine.currentScene.planet.objects.find(
        (o) => o.id === "kage-drone-2",
      ) ||
        g.engine.currentScene.planet.objects.find(
          (o) => o.id === "neon-drone-2",
        ),
    );
  });
  await expect(page.locator("#battle-hack")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
