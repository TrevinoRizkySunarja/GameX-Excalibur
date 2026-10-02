import * as ex from "excalibur";

const block = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const rand = (x, y) =>
  Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
export function floorGraphic(world) {
  return new ex.Canvas({
    width: 1440,
    height: 1040,
    cache: true,
    draw(ctx) {
      ctx.imageSmoothingEnabled = false;
      const k = world.id === "kage",
        c = world.id === "citadel";
      const floor = k ? "#172d26" : c ? "#1c202c" : "#142831";
      block(ctx, 0, 0, 1440, 1040, "#080f17");
      block(ctx, 55, 55, 1330, 930, floor);
      for (let y = 64; y < 980; y += 32)
        for (let x = 64; x < 1380; x += 32) {
          const r = rand(x, y);
          block(
            ctx,
            x,
            y,
            30,
            30,
            k
              ? r > 0.6
                ? "#20382d"
                : "#1c3229"
              : c
                ? r > 0.6
                  ? "#222431"
                  : "#1c212c"
                : r > 0.6
                  ? "#1a303a"
                  : "#172b35",
          );
          if (r > 0.85)
            block(ctx, x + 8, y + 10, 2, 2, k ? "#48634a" : "#2c434c");
          if (!k) {
            block(ctx, x, y, 30, 1, "#2a3541");
            if (r > 0.94)
              block(ctx, x + 18, y + 4, 7, 2, c ? "#9b433f" : "#235f69");
          }
        }
      // Continuous, readable paths connect the landing zone, hub and boss district.
      const path = k ? "#556048" : c ? "#353242" : "#34464b";
      block(ctx, 255, 635, 1050, 70, path);
      block(ctx, 850, 220, 72, 475, path);
      block(ctx, 900, 220, 270, 65, path);
      block(ctx, 275, 240, 70, 470, path);
      for (let x = 265; x < 1300; x += 32) {
        block(ctx, x, 650, 18, 2, k ? "#798369" : c ? "#7a494d" : "#a49968");
        block(ctx, x, 684, 18, 2, k ? "#798369" : c ? "#7a494d" : "#647b75");
      }
      block(ctx, 205, 720, 190, 175, k ? "#3a4a3e" : "#283940");
      for (let x = 205; x < 390; x += 24)
        block(ctx, x, 720, 12, 4, world.accent);
      block(ctx, 975, 180, 280, 175, k ? "#495449" : c ? "#3f2934" : "#24444e");
      for (let x = 985; x < 1240; x += 24) {
        block(ctx, x, 182, 9, 3, world.accent);
        block(ctx, x, 349, 9, 3, world.accent);
      }
      world.obstacles.forEach(([x, y, w, h], i) => {
        block(ctx, x + 12, y + 16, w, h, "#0d151a");
        if (k) {
          block(ctx, x, y, w, h, "#4e4032");
          block(ctx, x - 10, y - 5, w + 20, 20, "#784339");
          block(ctx, x - 4, y + 15, w + 8, 10, "#a95343");
          for (let px = x + 14; px < x + w - 12; px += 30) {
            block(ctx, px, y + 32, 18, h - 45, "#293b32");
            block(ctx, px + 1, y + 34, 2, h - 48, "#6d7153");
          }
          block(ctx, x + 8, y + h - 7, w - 16, 7, "#bd9670");
        } else {
          block(ctx, x, y, w, h, c ? "#483640" : "#263f4a");
          block(ctx, x + 5, y + 5, w - 10, h - 16, c ? "#332d3b" : "#1e3442");
          block(ctx, x, y, w, 4, c ? "#df695e" : "#59d5d3");
          for (let px = x + 16; px < x + w - 15; px += 24)
            for (let py = y + 18; py < y + h - 25; py += 20) {
              block(ctx, px, py, 12, 8, i % 2 ? world.accent : "#f6ac65");
              block(ctx, px, py + 8, 12, 2, "#0e1820");
            }
          block(ctx, x + w - 28, y + 8, 16, 13, "#132129");
          block(ctx, x + w - 22, y + 11, 4, 8, "#739394");
        }
      });
      // Trees, cables and small props give each chapter a distinct silhouette.
      for (let i = 0; i < 52; i++) {
        const x = 70 + rand(i, 12) * 1300,
          y = 85 + rand(i, 78) * 850;
        if (
          (y > 605 && y < 745) ||
          (x > 820 && x < 940) ||
          world.obstacles.some(
            ([ox, oy, w, h]) =>
              x > ox - 20 && x < ox + w + 20 && y > oy - 20 && y < oy + h + 20,
          )
        )
          continue;
        if (k) {
          block(ctx, x + 8, y + 10, 3, 25, "#597653");
          block(ctx, x - 6, y, 34, 6, "#38643f");
          block(ctx, x - 2, y - 8, 25, 8, "#4b7750");
          block(ctx, x + 9, y - 15, 3, 45, "#708955");
        } else {
          block(ctx, x, y, 12, 10, c ? "#563440" : "#314c58");
          block(ctx, x + 2, y + 2, 8, 2, world.accent);
          if (i % 3 === 0) {
            block(ctx, x + 16, y, 2, 35, "#546d76");
            block(ctx, x + 11, y - 6, 13, 6, world.accent);
          }
        }
      }
      if (k) {
        // Torii gate and pool beside Ren.
        block(ctx, 425, 635, 9, 62, "#af5747");
        block(ctx, 515, 635, 9, 62, "#af5747");
        block(ctx, 414, 625, 120, 8, "#de8d68");
        block(ctx, 424, 640, 102, 6, "#783b34");
        block(ctx, 555, 760, 145, 76, "#1a5462");
        block(ctx, 565, 770, 130, 4, "#5b9090");
      } else {
        for (let i = 0; i < 10; i++) {
          block(
            ctx,
            740 + i * 12,
            480 + i * 7,
            9,
            2,
            c ? "#a5474e" : "#378c95",
          );
        }
        ctx.save();
        ctx.translate(388, 564);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = world.accent;
        ctx.font = "bold 14px monospace";
        ctx.fillText(c ? "RESTRICTED" : "NIGHT MARKET", 0, 0);
        ctx.restore();
      }
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = world.accent;
      ctx.fillText("LANDING ZONE", 220, 930);
      ctx.fillText(
        k ? "ANCHOR SANCTUM" : c ? "CORE SECTOR" : "DISTRIBUTION SECTOR",
        965,
        158,
      );
      ctx.strokeStyle = world.accent;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1330, 930);
      ctx.globalAlpha = 1;
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
      } else if (entity.type === "terminal") {
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
    width: 52,
    height: 68,
    cache: false,
    draw(ctx) {
      ctx.clearRect(0, 0, 52, 68);
      const moving = player.vel.magnitude > 5,
        step = moving ? Math.sin(performance.now() / 100) * 2 : 0;
      const x = 26,
        y = 45;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#030b12";
      ctx.beginPath();
      ctx.ellipse(x, y + 14, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      block(ctx, x - 9, y - 6, 7, 17 + step, "#1b2933");
      block(ctx, x + 2, y - 6, 7, 17 - step, "#1b2933");
      block(ctx, x - 12, y - 23, 24, 24, "#327b80");
      block(ctx, x - 8, y - 18, 16, 9, "#285363");
      block(ctx, x - 10, y - 39, 20, 17, "#d2a582");
      block(ctx, x - 12, y - 43, 24, 10, "#17252b");
      block(ctx, x - 11, y - 35, 5, 6, "#17252b");
      block(ctx, x + 6, y - 35, 5, 6, "#17252b");
      if (player.facing === "up") block(ctx, x - 11, y - 36, 22, 13, "#20313b");
      else {
        block(ctx, x - 6, y - 31, 3, 3, "#101d23");
        block(ctx, x + 4, y - 31, 3, 3, "#101d23");
      }
      block(ctx, x - 12, y - 22, 25, 4, "#e9a04d");
      block(ctx, x - 15 - (moving ? 3 : 0), y - 18, 7, 11, "#d8863f");
      block(ctx, x - 15, y - 20, 5, 18, "#295d69");
      block(ctx, x + 11, y - 20, 5, 18, "#295d69");
      block(ctx, x + 12, y - 12, 9, 9, "#9af6e4");
      block(ctx, x + 14, y - 10, 5, 5, "#3d9fa8");
      block(ctx, x - 9, y + 9 + step, 7, 4, "#6c797a");
      block(ctx, x + 2, y + 9 - step, 7, 4, "#6c797a");
    },
  });
}
