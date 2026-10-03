import * as ex from "excalibur";
import { person, robot } from "./sprites.js";

const block = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const rand = (x, y) =>
  Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
const worldArt = {};
export async function loadWorldArt() {
  await Promise.all(
    ["neon", "kage", "citadel"].map(
      (id) =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            worldArt[id] = image;
            resolve();
          };
          image.onerror = () =>
            reject(new Error(`Map artwork unavailable: ${id}`));
          image.src = `${import.meta.env.BASE_URL}art/worlds/${id}.webp`;
        }),
    ),
  );
}
export function floorGraphic(world) {
  return new ex.Canvas({
    width: world.width,
    height: world.height,
    cache: true,
    draw(ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(worldArt[world.id], 0, 0, world.width, world.height);
    },
  });
}

export function entityGraphic(entity, world, getActive) {
  return new ex.Canvas({
    width: 112,
    height: 116,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 112, 116);
      const x = 56,
        y = 60,
        t = performance.now() / 1000;
      const accent = world.accent;
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(
        x,
        y + 10,
        entity.type === "ship" ? 45 : 19,
        8,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
      if (entity.type === "npc") {
        const k = world.id === "kage";
        block(ctx, x - 10, y - 21, 20, 23, k ? "#5d7254" : "#af7450");
        block(ctx, x - 9, y - 37, 18, 18, k ? "#e3c09c" : "#abbfc6");
        block(
          ctx,
          x - 10,
          y - 39,
          20,
          7,
          k ? (entity.id === "ren" ? "#ded5b4" : "#1d2930") : "#b77843",
        );
        block(ctx, x - 7, y - 28, 4, 3, "#79f9e7");
        block(ctx, x + 4, y - 28, 4, 3, "#79f9e7");
        block(ctx, x - 11, y + 2, 7, 8, "#262d31");
        block(ctx, x + 4, y + 2, 7, 8, "#262d31");
        block(ctx, x - 15, y - 18, 5, 16, k ? "#a08b60" : "#7e543c");
        block(ctx, x + 10, y - 18, 5, 16, k ? "#a08b60" : "#7e543c");
      } else if (entity.type === "ship") {
        block(ctx, 15, 32, 82, 20, "#40555d");
        block(ctx, 20, 24, 72, 17, "#59737c");
        block(ctx, 36, 15, 41, 22, "#718a8f");
        block(ctx, 45, 18, 21, 9, "#68dcd7");
        block(ctx, 13, 45, 20, 12, "#253840");
        block(ctx, 79, 45, 20, 12, "#253840");
        block(ctx, 17, 49, 9, 5, "#efa865");
        block(ctx, 86, 49, 9, 5, "#efa865");
        block(ctx, 36, 54, 40, 5, "#34454e");
      } else if (entity.type === "boss") {
        block(ctx, x - 26, y - 35, 52, 35, "#5a4b55");
        block(ctx, x - 18, y - 48, 36, 20, "#777681");
        block(ctx, x - 12, y - 42, 24, 6, "#ff8068");
        block(ctx, x - 34, y - 25, 10, 33, "#384550");
        block(ctx, x + 24, y - 25, 10, 33, "#384550");
        block(ctx, x - 21, y, 14, 16, "#24313b");
        block(ctx, x + 7, y, 14, 16, "#24313b");
        block(ctx, x - 7, y - 20, 14, 12, accent);
        block(ctx, x - 27, y - 32, 54, 4, "#c59477");
      } else if (entity.type === "enemy") {
        const hover = Math.sin(t * 3) * 3;
        block(ctx, x - 17, y - 21 + hover, 34, 15, "#637683");
        block(ctx, x - 9, y - 28 + hover, 18, 10, "#8999a4");
        block(ctx, x - 6, y - 18 + hover, 12, 4, "#ff7c72");
        block(ctx, x - 23, y - 20 + hover, 8, 5, accent);
        block(ctx, x + 15, y - 20 + hover, 8, 5, accent);
      } else if (["terminal", "sidehack", "practice"].includes(entity.type)) {
        block(ctx, x - 13, y - 31, 26, 38, "#506470");
        block(ctx, x - 10, y - 27, 20, 18, "#142d36");
        block(ctx, x - 7, y - 24, 14, 3, accent);
        block(ctx, x - 7, y - 17, 7, 3, accent);
        block(ctx, x - 18, y + 6, 36, 5, "#72838a");
        if (world.id === "kage") {
          block(ctx, x - 4, y - 46, 8, 12, accent);
          block(ctx, x - 21, y - 39, 42, 3, "#a59264");
        }
      } else if (entity.type === "chest") {
        block(ctx, x - 18, y - 20, 36, 29, "#917354");
        block(ctx, x - 16, y - 17, 32, 8, "#c39b6a");
        block(ctx, x - 18, y - 7, 36, 3, "#342f2b");
        block(ctx, x - 3, y - 11, 6, 11, "#f8c66d");
      } else if (entity.type === "secret") {
        ctx.strokeStyle = accent;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 16, y - 22, 32, 32);
        ctx.setLineDash([]);
        block(ctx, x - 6, y - 12, 12, 12, accent);
      } else if (entity.type === "loot") {
        const h = Math.sin(t * 3) * 4;
        ctx.fillStyle = "#ffcb7e";
        ctx.beginPath();
        ctx.moveTo(x, y - 15 + h);
        ctx.lineTo(x + 7, y - 8 + h);
        ctx.lineTo(x, y - 1 + h);
        ctx.lineTo(x - 7, y - 8 + h);
        ctx.fill();
      }
      if (entity.type === "ship") {
        for (let i = 0; i < 5; i++) {
          block(ctx, 28 + i * 11, 30, 1, 17, "#203e4c");
          block(ctx, 28 + i * 11, 31, 2, 2, "#c4d2c5");
        }
        block(ctx, 39, 16, 36, 2, "#b2c1b7");
        block(ctx, 45, 19, 20, 2, "#c1fff1");
        block(ctx, 53, 19, 2, 8, "#304c5c");
        block(ctx, 38, 40, 36, 11, "#243e4a");
        for (let i = 0; i < 4; i++) block(ctx, 41 + i * 8, 43, 5, 5, "#758b8c");
        block(ctx, 49, 52, 15, 9, "#536970");
        block(ctx, 50, 58, 13, 3, "#92a79f");
        block(ctx, 17, 48, 9, 2, "#ffdb92");
        block(ctx, 86, 48, 9, 2, "#ffdb92");
      } else if (["terminal", "sidehack", "practice"].includes(entity.type)) {
        block(ctx, x - 12, y - 30, 3, 30, "#99a7a7");
        block(ctx, x + 10, y - 28, 2, 33, "#243c49");
        block(ctx, x - 7, y - 11, 14, 2, "#7ca8b2");
        for (let i = 0; i < 3; i++)
          block(
            ctx,
            x - 7 + i * 5,
            y - 5,
            3,
            2,
            i === 2 ? "#e7b970" : "#8eacb2",
          );
        block(ctx, x - 5, y, 10, 4, "#1c3441");
      } else if (entity.type === "boss") {
        for (let i = -1; i <= 1; i++)
          block(ctx, x + i * 14 - 3, y - 29, 6, 5, "#c8a384");
        block(ctx, x - 5, y - 18, 10, 2, "#f6dd97");
        block(ctx, x - 17, y - 46, 3, 16, "#b4b7b5");
        for (const dx of [-29, 26])
          for (let i = 0; i < 3; i++)
            block(ctx, x + dx, y - 21 + i * 8, 4, 3, "#9a9591");
      } else if (entity.type === "chest") {
        for (const dx of [-14, 10]) {
          block(ctx, x + dx, y - 19, 4, 27, "#506671");
          block(ctx, x + dx, y - 18, 2, 25, "#9dadab");
        }
        block(ctx, x - 14, y - 18, 26, 2, "#e9c387");
      } else if (entity.type === "enemy") {
        const h = Math.sin(t * 3) * 3;
        block(ctx, x - 16, y - 21 + h, 9, 2, "#bcc5c4");
        block(ctx, x + 8, y - 21 + h, 8, 2, "#c1c8c7");
        block(ctx, x - 5, y - 27 + h, 9, 3, "#394c5d");
        block(ctx, x - 4, y - 17 + h, 8, 2, "#ffc9a5");
        block(ctx, x - 11, y - 8 + h, 4, 3, "#293d4d");
        block(ctx, x + 7, y - 8 + h, 4, 3, "#293d4d");
      }
      if (entity.type !== "loot") {
        const active = getActive?.();
        ctx.textAlign = "center";
        ctx.font = "10px monospace";
        ctx.fillStyle = active ? "#f7ddad" : "#adbfbd";
        ctx.fillText(
          entity.type === "boss"
            ? "⚠ " + entity.name.split(" · ")[0]
            : entity.name,
          56,
          96,
        );
        if (active) {
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(
            x,
            y + 14,
            25 + Math.sin(t * 4) * 2,
            10,
            0,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }
    },
  });
}

export function playerGraphic(player) {
  return new ex.Canvas({
    width: 64,
    height: 80,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 64, 80);
      person(ctx, 32, 64, {
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
      ctx.fillStyle = "#0008";
      ctx.beginPath();
      ctx.ellipse(x, y + 9, 17, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      if (obj.style === "robot") robot(ctx, x, 83, world.accent, step);
      else
        person(ctx, x, 83, {
          coat,
          light,
          accent: world.accent,
          facing: actor.facing,
          step,
          robe: world.id === "kage",
          elder: obj.id === "ren",
          hair:
            obj.id === "ren"
              ? "#c5c4b0"
              : obj.style === "red"
                ? "#814b3b"
                : "#283742",
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
