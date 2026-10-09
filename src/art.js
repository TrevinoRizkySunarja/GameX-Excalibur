import * as ex from "excalibur";
import { worldMapCanvas, loadScenery } from "./world-renderer.js";
import { cleanEntityGraphic, drawAvatar } from "./entities.js";
import { CHARACTERS, characterFor } from "./story.js";

export async function loadWorldArt(worlds) {
  await loadScenery();
  for (const world of worlds) worldMapCanvas(world);
}
export function floorGraphic(world) {
  return new ex.Canvas({
    width: world.width,
    height: world.height,
    cache: true,
    draw(ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(worldMapCanvas(world), 0, 0);
    },
  });
}

export function entityGraphic(entity, world, getActive, solved) {
  return cleanEntityGraphic(entity, world, getActive, solved);
}
export function playerGraphic(player) {
  return new ex.Canvas({
    width: 64,
    height: 80,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 64, 80);
      drawAvatar(ctx, 32, 64, {
        facing: player.facing,
        step:
          player.vel.magnitude > 5 ? Math.sin(performance.now() / 100) * 3 : 0,
        hero: true,
      });
    },
  });
}

// Animated citizens have separate legs, sleeves, faces, clothing and idle gestures.
export function citizenGraphic(actor, obj, world, getActive) {
  return new ex.Canvas({
    width: 140,
    height: 112,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 140, 112);
      const x = 70,
        y = 73,
        moving = actor.vel.magnitude > 2;
      const step = moving ? Math.round(Math.sin(actor.walkPhase) * 4) : 0,
        bob = moving
          ? Math.abs(step) / 3
          : Math.sin(performance.now() / 650) * 0.6;
      const colors = {
        amber: ["#b66a32", "#edaf64"],
        violet: ["#665388", "#bca0d9"],
        green: ["#386957", "#80ac89"],
        blue: ["#365f7b", "#8cbbc7"],
        red: ["#873e4c", "#db8081"],
        robot: ["#778a95", "#bad4db"],
      };
      const [coat, light] =
        colors[obj.style] || colors[world.id === "kage" ? "green" : "amber"];
      const look = CHARACTERS[characterFor(obj.name, obj.portrait)];
      ctx.fillStyle = "#0008";
      ctx.beginPath();
      ctx.ellipse(x, y + 9, 17, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      drawAvatar(ctx, x, 83, {
        coat: look?.coat || coat,
        light,
        accent: look?.accent || world.accent,
        kind: look?.kind,
        skin: look?.skin,
        facing: actor.facing,
        step,
        robe: world.id === "kage",
        elder: obj.id === "ren",
        robot: obj.style === "robot",
        hair: look?.hair,
      });
      if (getActive()) {
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        const name = obj.name.split(" · ")[0];
        ctx.fillStyle = "#07151edf";
        ctx.fillRect(x - 66, 1, 132, 18);
        ctx.fillStyle = "#ffe4ae";
        ctx.fillText(name, x, 14);
        ctx.strokeStyle = world.accent;
        ctx.beginPath();
        ctx.ellipse(x, y + 12, 23, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.trader) {
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#f3ce8b";
        ctx.fillText("◆", x, 15);
      } else if (obj.quest) {
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffce73";
        ctx.fillText("!", x, y - 60);
      }
    },
  });
}
export function weatherGraphic(world, controller) {
  return new ex.Canvas({
    width: 1600,
    height: 1000,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 1600, 1000);
      if (controller.paused) return;
      const t = performance.now() / 1000;
      if (world.id === "neon") {
        ctx.strokeStyle = "#87bdd337";
        ctx.lineWidth = 1;
        for (let i = 0; i < 90; i++) {
          const x = (i * 173 + t * 95) % 1600,
            y = (i * 127 + t * 390) % 1000;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y + 12);
          ctx.stroke();
        }
      } else {
        for (let i = 0; i < 26; i++) {
          const x = (i * 173 + t * 18) % 1600,
            y = (i * 139 + t * 25) % 1000;
          ctx.fillStyle = world.id === "kage" ? "#eebbce7a" : "#f68d5a68";
          ctx.fillRect(
            x + Math.sin(t + i) * 9,
            y,
            world.id === "kage" ? 4 : 2,
            2,
          );
        }
      }
    },
  });
}
