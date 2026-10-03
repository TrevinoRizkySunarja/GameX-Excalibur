import { expect } from "@playwright/test";
export async function solveExtra(page, type) {
  if (type === "rhythm") {
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          let previous = "";
          const end = performance.now() + 18000;
          const step = () => {
            const b = document.querySelector(".rhythm-target");
            if (!b || b.closest("[inert]")) {
              resolve();
              return;
            }
            if (performance.now() > end) {
              reject(Error("Rhythm timeout"));
              return;
            }
            const number = b.querySelector("span").textContent;
            if (b.classList.contains("ready") && number !== previous) {
              previous = number;
              b.click();
            }
            requestAnimationFrame(step);
          };
          step();
        }),
    );
  } else if (type === "maze") {
    await page.locator("#maze-start").click();
    const box = await page.locator(".maze-board").boundingBox();
    const points = [
      [25, 190],
      [100, 190],
      [100, 62],
      [210, 62],
      [210, 168],
      [324, 168],
      [324, 60],
      [385, 60],
    ];
    for (const [x, y] of points)
      await page.mouse.move(
        box.x + (x / 410) * box.width,
        box.y + (y / 230) * box.height,
        { steps: 20 },
      );
  } else if (type === "chess") {
    const q = await page
      .locator("[data-square]")
      .evaluateAll(
        (bs) => bs.find((b) => b.textContent.includes("♕")).dataset.square,
      );
    const target = { g6: "g7", b6: "b7", b3: "b2", g3: "g2" }[q];
    await page.locator(`[data-square="${q}"]`).click();
    await page.locator(`[data-square="${target}"]`).click();
  } else if (type === "sequence") {
    for (let n = 1; n <= 9; n++)
      await page.locator(`[data-number="${n}"]`).click();
  } else if (type === "pipes") {
    const glyph = ["└", "┌", "┐", "┘"],
      correct = [2, 1, 2, 0, 3, 0];
    for (let i = 0; i < 6; i++) {
      const b = page.locator(`[data-pipe="${i}"]`);
      for (let j = 0; j < 4; j++) {
        if ((await b.textContent()).startsWith(glyph[correct[i]])) break;
        await b.click();
      }
    }
    await page.locator("#pipe-check").click();
  } else if (type === "frequency") {
    for (let i = 0; i < 3; i++) {
      const s = page.locator(`[data-frequency="${i}"]`);
      const target = await s.locator("..").locator("b").textContent();
      await s.fill(target);
      await s.dispatchEvent("input");
    }
    await page.locator("#frequency-check").click();
  } else if (type === "keypad") {
    const code = await page.locator("#code-display").textContent();
    await expect(page.locator("#code-phase")).toContainText("Voer");
    for (const c of code) await page.locator(`[data-key="${c}"]`).click();
    await page.locator('[data-key="↵"]').click();
  } else if (type === "asteroids") {
    // Clicking the DOM buttons exercises target classification without chasing a moving test locator.
    for (let i = 0; i < 7; i++)
      await page.locator(`[data-target="${i}"]`).dispatchEvent("click");
  } else if (type === "clean") {
    for (let i = 0; i < 6; i++) {
      await page.locator(`[data-trash="${i}"]`).click();
      await page.locator("#filter-bin").click();
    }
  } else if (type === "balance") {
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const end = performance.now() + 15000;
          let last = 0;
          const tick = (now) => {
            const n = document.querySelector("#balance-needle");
            if (!n || n.closest("[inert]")) {
              resolve();
              return;
            }
            if (now > end) {
              reject(Error("Balance timeout"));
              return;
            }
            const x = parseFloat(n.style.left);
            if (now - last > 150) {
              if (x > 56) document.querySelector("#balance-left").click();
              if (x < 44) document.querySelector("#balance-right").click();
              last = now;
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
  } else if (type === "locks") {
    const target = (await page.locator(".lock-target").textContent()).split(
      " ",
    );
    for (let i = 0; i < 3; i++) {
      const b = page.locator(`[data-dial="${i}"]`);
      for (let j = 0; j < 6; j++) {
        if ((await b.textContent()) === target[i]) break;
        await b.click();
      }
    }
    await page.locator("#unlock-check").click();
  } else throw Error("Unhandled hack " + type);
}
