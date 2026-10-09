import * as ex from "excalibur";

const shape = (c, x, y, w, h, r, color, stroke = "#14232e") => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = color;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1.3;
    c.stroke();
  }
};
const oval = (c, x, y, rx, ry, color) => {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
};
function drone(c, x, y, accent, big = false) {
  const size = big ? 1.4 : 1;
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  shape(c, -23, -12, 46, 12, 5, "#344554");
  shape(c, -16, -27, 32, 28, 8, "#81929b");
  shape(c, -12, -23, 24, 11, 4, "#283440");
  shape(c, -8, -20, 16, 5, 2, accent, null);
  shape(c, -6, -8, 12, 7, 2, "#c8c1b4");
  for (const xx of [-27, 17]) shape(c, xx, -17, 10, 14, 4, "#abb6b7");
  c.restore();
}
export function drawAvatar(c, x, y, options = {}) {
  const {
    coat = "#4d8592",
    accent = "#efb27e",
    facing = "down",
    step = 0,
    robot = false,
    elder = false,
    robe = false,
    hero = false,
    skin = "#deb99f",
    hair = elder ? "#d4d8cd" : "#303644",
    kind = "young",
  } = options;
  oval(c, x, y + 2, 13, 5, "#10212e5c");
  if (robot) {
    shape(c, x - 8, y - 15, 5, 17, 2, "#526675");
    shape(c, x + 3, y - 15, 5, 17, 2, "#526675");
    shape(c, x - 13, y - 32, 26, 22, 6, coat);
    shape(c, x - 18, y - 31, 5, 19, 3, "#87999c");
    shape(c, x + 13, y - 31, 5, 19, 3, "#87999c");
    oval(c, x, y - 42, 14, 14, "#b8b8a5");
    oval(c, x, y - 42, 10, 10, "#223442");
    oval(c, x, y - 42, 6, 6, accent);
    oval(c, x - 2, y - 44, 2, 2, "#efffea");
    shape(c, x - 5, y - 24, 10, 4, 1, accent);
    return;
  }
  for (const [dx, swing] of [
    [-7, step],
    [2, -step],
  ]) {
    shape(c, x + dx, y - 13 + swing, 6, 13, 2, "#364150");
    shape(c, x + dx - 1, y - 1 + swing, 8, 4, 2, "#192c36");
  }
  shape(c, x - 10, y - 34, 20, robe ? 29 : 22, 5, coat);
  shape(c, x - 9, y - 19, 18, 3, 1, "#293b4590");
  shape(c, x - 2, y - 18, 4, 3, 1, "#c1ab79");
  shape(c, x - 7, y - 31, 3, 11, 1, "#dce4d249", null);
  shape(c, x - 14, y - 30 - step * 0.35, 5, 19, 3, coat);
  shape(c, x + 9, y - 30 + step * 0.35, 5, 19, 3, coat);
  oval(c, x - 11, y - 11 - step * 0.35, 2.3, 3, skin);
  oval(c, x + 11, y - 11 + step * 0.35, 2.3, 3, skin);
  if (hero) {
    shape(c, x - 7, y - 31, 17, 5, 2, accent);
    shape(c, x + 2, y - 28, 5, 14, 2, accent);
  }
  if (kind === "bob" || kind === "ponytail") oval(c, x, y - 43, 11, 14, hair);
  if (kind === "ponytail")
    oval(c, x + (facing === "left" ? 10 : -10), y - 32, 5, 12, hair);
  oval(c, x, y - 42, 8, 11, skin);
  oval(c, x + 4, y - 41, 3, 8, "#91695b25");
  c.fillStyle = hair;
  c.beginPath();
  c.moveTo(x - 9, y - 41);
  c.quadraticCurveTo(x - 13, y - 59, x + 6, y - 52);
  c.quadraticCurveTo(x + 12, y - 53, x + 9, y - 37);
  c.lineTo(x + 3, y - 48);
  c.lineTo(x - 1, y - 42);
  c.lineTo(x - 4, y - 47);
  c.closePath();
  c.fill();
  if (facing === "up") {
    oval(c, x, y - 43, 8, 9, hair);
  } else {
    c.strokeStyle = "#2b3541";
    c.lineWidth = 1.2;
    c.beginPath();
    if (facing !== "right") {
      c.moveTo(x - 5, y - 40);
      c.lineTo(x - 2, y - 40);
    }
    if (facing !== "left") {
      c.moveTo(x + 2, y - 40);
      c.lineTo(x + 5, y - 40);
    }
    c.stroke();
    c.beginPath();
    c.moveTo(x - 2, y - 35);
    c.lineTo(x + 2, y - 35);
    c.stroke();
    if (elder) {
      oval(c, x, y - 32, 5, 6, "#d4d8cd");
    }
  }
  if (hero && facing !== "up") {
    shape(c, x + 12, y - 20 + step * 0.3, 6, 9, 2, "#70e2db");
  }
}
export function cleanEntityGraphic(
  entity,
  world,
  getActive,
  solved = () => false,
) {
  return new ex.Canvas({
    width: 140,
    height: 136,
    cache: false,
    draw(c) {
      c.clearRect(0, 0, 140, 136);
      const x = 70,
        y = 77,
        active = getActive?.(),
        t = performance.now() / 1000;
      const accent = solved() ? "#93dfaa" : world.accent;
      oval(c, x, y + 2, entity.type === "ship" ? 45 : 22, 8, "#06172355");
      if (entity.type === "enemy" || entity.type === "boss") {
        if (entity.members) {
          c.globalAlpha = 0.85;
          drone(c, x - 29, y - 6, "#ec9f8e");
          drone(c, x + 29, y - 8, "#dc7e8b");
          c.globalAlpha = 1;
        }
        drone(c, x, y + Math.sin(t * 3) * 2, "#ef938b", entity.type === "boss");
        if (entity.members) {
          c.fillStyle = "#efb185";
          c.font = "bold 10px sans-serif";
          c.textAlign = "center";
          c.fillText("×" + entity.members.length + "  GROEP", x, 22);
        }
      } else if (entity.type === "ship") {
        c.fillStyle = "#617a89";
        c.strokeStyle = "#142b3b";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(x, y - 47);
        c.lineTo(x + 20, y - 17);
        c.lineTo(x + 50, y + 2);
        c.lineTo(x + 32, y + 12);
        c.lineTo(x, y + 3);
        c.lineTo(x - 32, y + 12);
        c.lineTo(x - 50, y + 2);
        c.lineTo(x - 20, y - 17);
        c.closePath();
        c.fill();
        c.stroke();
        shape(c, x - 14, y - 35, 28, 39, 9, "#c0d0ca");
        shape(c, x - 10, y - 27, 20, 13, 6, "#4ca7b1");
        for (const dx of [-29, 22]) {
          shape(c, x + dx, y + 2, 7, 7, 2, "#efa974");
        }
        shape(c, x - 11, y - 4, 22, 5, 2, "#487684");
      } else if (entity.type === "chest") {
        shape(c, x - 19, y - 29, 38, 30, 5, "#8a7e78");
        shape(c, x - 18, y - 27, 36, 10, 3, "#bcaa87");
        for (const dx of [-14, 10])
          shape(c, x + dx, y - 27, 4, 28, 1, "#567381");
        shape(c, x - 4, y - 18, 8, 10, 2, "#ecc48a");
      } else if (["terminal", "sidehack", "practice"].includes(entity.type)) {
        shape(c, x - 14, y - 42, 28, 44, 6, "#638591");
        shape(c, x - 10, y - 36, 20, 20, 3, "#243c4b");
        shape(c, x - 7, y - 32, 14, 3, 1, accent, null);
        shape(c, x - 7, y - 26, 8, 3, 1, accent, null);
        shape(c, x - 21, y - 1, 42, 5, 2, "#90a4ab");
        if (world.id === "kage") {
          oval(c, x, y - 50, 7, 7, "#e9c58d");
        }
      } else if (entity.type === "secret") {
        c.strokeStyle = "#ceb4e6";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(x, y - 16, 20, 0, Math.PI * 2);
        c.stroke();
        shape(c, x - 6, y - 23, 12, 15, 3, "#b6a4d8");
      } else if (entity.type === "loot") {
        const yy = y - 14 + Math.sin(t * 3) * 3;
        c.fillStyle = "#f2cb8e";
        c.beginPath();
        c.moveTo(x, yy - 10);
        c.lineTo(x + 8, yy);
        c.lineTo(x, yy + 10);
        c.lineTo(x - 8, yy);
        c.closePath();
        c.fill();
        return;
      }
      if (active) {
        c.strokeStyle = accent;
        c.lineWidth = 1.5;
        c.beginPath();
        c.ellipse(x, y + 6, 26, 9, 0, 0, Math.PI * 2);
        c.stroke();
      }
      c.fillStyle = active ? "#f7d9ad" : "#ccdad4";
      c.font = "10px sans-serif";
      c.textAlign = "center";
      c.fillText(entity.gangName || entity.name.split(" · ")[0], x, 115, 134);
    },
  });
}
