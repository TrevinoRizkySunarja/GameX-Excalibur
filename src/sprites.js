// Hand-authored pixel shapes keep live actors separate from the world paintings.
const r = (c, x, y, w, h, color) => {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};
export function person(
  c,
  x,
  y,
  {
    coat = "#327b80",
    light = "#65adb0",
    facing = "down",
    step = 0,
    hair = "#27313e",
    hero = false,
    robe = false,
    accent = "#8ed9dc",
    elder = false,
  } = {},
) {
  x = Math.round(x);
  y = Math.round(y);
  step = Math.round(step);
  const bob = step ? (Math.abs(step) > 2 ? 1 : 0) : 0;
  y -= bob;
  const outline = "#111c26",
    shadow = "#22363f",
    skin = "#d5a482",
    skinShade = "#a86f59";
  c.fillStyle = "#02071085";
  c.beginPath();
  c.ellipse(x, y + 2, 15, 5, 0, 0, Math.PI * 2);
  c.fill();
  // Boots, knee armor and seams.
  for (const [dx, walk] of [
    [-10, step],
    [2, -step],
  ]) {
    r(c, x + dx - 1, y - 20 + walk, 10, 21, outline);
    r(c, x + dx, y - 19 + walk, 8, 14, "#354451");
    r(c, x + dx + 1, y - 18 + walk, 3, 11, "#59656b");
    r(c, x + dx, y - 7 + walk, 9, 7, "#252e37");
    r(c, x + dx + 1, y - 6 + walk, 6, 2, "#b99c74");
    r(c, x + dx - 1, y + walk, 11, 2, "#0d151d");
  }
  // A coat with collar, shoulder plates, pockets and a separate shaded side.
  r(c, x - 13, y - 43, 26, 27, outline);
  r(c, x - 12, y - 41, 24, 24, coat);
  r(c, x - 9, y - 40, 7, 21, light);
  r(c, x + 7, y - 39, 4, 22, shadow);
  r(c, x - 3, y - 40, 2, 25, "#b3b6a0");
  r(c, x - 10, y - 27, 7, 7, shadow);
  r(c, x - 10, y - 27, 7, 2, light);
  r(c, x + 2, y - 27, 6, 7, shadow);
  r(c, x + 2, y - 27, 6, 2, light);
  r(c, x - 12, y - 19, 24, 4, "#25313a");
  r(c, x - 3, y - 19, 5, 4, "#c6a576");
  r(c, x - 2, y - 18, 3, 2, "#51443d");
  for (const [dx, walk] of [
    [-17, step / 2],
    [12, -step / 2],
  ]) {
    r(c, x + dx - 1, y - 41 + walk, 7, 23, outline);
    r(c, x + dx, y - 40 + walk, 5, 16, coat);
    r(c, x + dx, y - 39 + walk, 2, 12, light);
    r(c, x + dx, y - 27 + walk, 5, 3, "#314651");
    r(c, x + dx, y - 23 + walk, 5, 5, skinShade);
    r(c, x + dx + 1, y - 23 + walk, 3, 3, skin);
    r(c, x + dx, y - 20 + walk, 5, 3, "#1d2b36");
  }
  // Asymmetrical hair silhouette and shaded face.
  r(c, x - 10, y - 60, 20, 20, outline);
  r(c, x - 8, y - 56, 17, 15, skinShade);
  r(c, x - 7, y - 55, 14, 12, skin);
  r(c, x - 5, y - 54, 8, 6, "#eac1a0");
  r(c, x - 9, y - 62, 14, 5, hair);
  r(c, x - 11, y - 59, 22, 6, hair);
  r(c, x - 10, y - 56, 4, 10, hair);
  r(c, x + 6, y - 56, 4, 6, hair);
  r(c, x - 6, y - 61, 8, 2, elder ? "#f0e7c9" : "#52606c");
  r(c, x - 1, y - 58, 9, 3, hair);
  r(c, x - 5, y - 54, 3, 2, hair);
  if (facing === "up") {
    r(c, x - 9, y - 56, 18, 14, hair);
    r(c, x - 7, y - 53, 10, 4, elder ? "#b6b9aa" : "#354251");
    r(c, x - 7, y - 38, 15, 19, "#243442");
    r(c, x - 6, y - 37, 12, 15, "#546770");
    r(c, x - 5, y - 36, 10, 3, "#7e9295");
    r(c, x - 5, y - 30, 10, 2, accent);
    r(c, x - 4, y - 24, 8, 2, "#263a45");
  } else {
    const side = facing === "left" ? -4 : facing === "right" ? 4 : 0;
    if (!side) {
      r(c, x - 5, y - 50, 3, 2, outline);
      r(c, x + 4, y - 50, 3, 2, outline);
      r(c, x - 5, y - 50, 1, 1, "#f0e3be");
      r(c, x + 4, y - 50, 1, 1, "#f0e3be");
    } else {
      r(c, x + side, y - 50, 3, 2, outline);
      r(c, x + side * 2, y - 48, 3, 3, skinShade);
    }
    r(c, x - 2 + side / 2, y - 47, 3, 2, skinShade);
    r(c, x - 2 + side / 2, y - 43, 5, 1, "#7e4e48");
    if (elder) {
      r(c, x - 6, y - 45, 12, 6, "#d1ccaf");
      r(c, x - 3, y - 40, 6, 3, "#e9dfc1");
    }
  }
  if (robe) {
    r(c, x - 14, y - 30, 28, 5, "#ceb081");
    r(c, x - 3, y - 28, 6, 7, "#e4c193");
    r(c, x + 14, y - 34, 3, 36, "#131f28");
    r(c, x + 15, y - 31, 2, 31, "#94a6a4");
    r(c, x + 11, y - 33, 9, 3, "#c5a678");
  }
  if (hero) {
    r(c, x - 12, y - 41, 24, 4, "#e4a450");
    r(c, x - 15 - step, y - 37, 6, 13, "#c7773e");
    r(c, x - 14 - step, y - 37, 2, 10, "#f1be67");
    r(c, x + 11, y - 26, 12, 11, "#162f3a");
    r(c, x + 12, y - 25, 10, 8, "#55848a");
    r(c, x + 14, y - 24, 7, 5, "#91eee0");
    r(c, x + 15, y - 23, 4, 2, "#e5fff2");
    r(c, x + 18, y - 17, 2, 3, "#dba963");
  } else {
    r(c, x + 6, y - 38, 3, 5, accent);
    r(c, x - 10, y - 39, 5, 2, "#c8b891");
  }
}
export function robot(c, x, y, accent, step = 0) {
  r(c, x - 13, y - 37, 26, 29, "#152a36");
  r(c, x - 11, y - 35, 22, 25, "#687f89");
  r(c, x - 9, y - 33, 9, 20, "#adc0c3");
  r(c, x + 4, y - 33, 6, 20, "#435f6b");
  r(c, x - 9, y - 50, 18, 16, "#1b303e");
  r(c, x - 7, y - 49, 14, 3, "#829da5");
  r(c, x - 7, y - 44, 14, 4, accent);
  r(c, x - 4, y - 43, 2, 2, "#e3fff5");
  r(c, x + 4, y - 43, 2, 2, "#e3fff5");
  r(c, x - 5, y - 37, 10, 3, "#304854");
  r(c, x - 8, y - 24, 16, 10, "#304650");
  r(c, x - 5, y - 22, 10, 2, accent);
  r(c, x - 2, y - 18, 6, 2, "#e5ac66");
  for (const [dx, s] of [
    [-17, step],
    [12, -step],
  ]) {
    r(c, x + dx, y - 32, 5, 19, "#304957");
    r(c, x + dx, y - 31, 3, 11, "#94a7ab");
    r(c, x + dx, y - 14, 5, 5, "#202f3b");
  }
  for (const [dx, s] of [
    [-10, step],
    [3, -step],
  ]) {
    r(c, x + dx, y - 8 + s, 7, 9, "#2d3f4d");
    r(c, x + dx - 1, y + s, 10, 3, "#819397");
    r(c, x + dx, y + s, 8, 1, accent);
  }
  r(c, x + 6, y - 56, 2, 7, "#576c73");
  r(c, x + 5, y - 57, 4, 3, accent);
}
