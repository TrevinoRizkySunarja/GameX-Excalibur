// Authored map graphics. Every street is drawn from the same geometry used by
// movement and navigation; illustration cannot silently invent a blocked route.
const palettes = {
  neon: {
    ground: "#122b37",
    road: "#36525e",
    edge: "#8da4a8",
    wall: "#182c40",
    roof: "#335669",
    trim: "#69daca",
    light: "#efaa74",
    water: "#143a51",
  },
  kage: {
    ground: "#263d35",
    road: "#acb69b",
    edge: "#d2d2b5",
    wall: "#785954",
    roof: "#3f6570",
    trim: "#edbc88",
    light: "#fff0bf",
    water: "#4b8b91",
  },
  citadel: {
    ground: "#151e30",
    road: "#46515d",
    edge: "#8b8a8c",
    wall: "#2a2a3d",
    roof: "#515264",
    trim: "#d95b60",
    light: "#efa783",
    water: "#5b2c39",
  },
};
const cache = new Map();
const architecture = new Map();
const scenery = {
  neon: ["neon-workshop", "neon-warehouse"],
  kage: ["kage-temple", "kage-pavilion"],
  citadel: ["citadel-prison", "citadel-reactor"],
};
export async function loadScenery() {
  await Promise.all(
    Object.values(scenery)
      .flat()
      .map(
        (name) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
              architecture.set(name, image);
              resolve();
            };
            image.onerror = () => resolve(); // Authored Canvas buildings remain a usable fallback.
            image.src = `${import.meta.env.BASE_URL}art/scenery/${name}.webp`;
          }),
      ),
  );
  cache.clear();
}
const noise = (x, y) => (Math.sin(x * 13.71 + y * 67.19) * 1273.37) % 1;
const rounded = (c, x, y, w, h, r, fill, stroke) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.stroke();
  }
};
const line = (c, points, color, width = 1) => {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.stroke();
};
const ellipse = (c, x, y, rx, ry, fill) => {
  c.fillStyle = fill;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
};
function tree(c, x, y, size, sakura = false) {
  ellipse(c, x + 10, y + 16, size, size * 0.6, "#07141a4d");
  line(
    c,
    [
      [x, y + 20],
      [x - 1, y - 11],
    ],
    "#6e5e55",
    5,
  );
  const colors = sakura
    ? ["#a77292", "#d5a3b7", "#ecd1cf"]
    : ["#315f58", "#477e65", "#78a080"];
  for (let i = 0; i < 11; i++) {
    const a = i * 2.4,
      distance = i < 5 ? 0.5 : 0.27;
    ellipse(
      c,
      x + Math.cos(a) * size * distance,
      y - 10 + Math.sin(a) * size * distance * 0.7,
      size * 0.42,
      size * 0.32,
      colors[i % 3],
    );
  }
  for (let i = 0; i < 9; i++) {
    const a = i * 2.4,
      dx = Math.cos(a) * size * 0.65,
      dy = Math.sin(a) * size * 0.4 - 10;
    line(
      c,
      [
        [x + dx - 3, y + dy],
        [x + dx, y + dy - 2],
        [x + dx + 4, y + dy],
      ],
      sakura ? "#f3dddb88" : "#8db19088",
      1.5,
    );
  }
}
function building(c, x, y, w, h, p, id, index) {
  const illustration = architecture.get(scenery[id][index % 2]);
  if (illustration && w > 95 && h > 65) {
    // Place individual architecture on authored footprints; streets are never
    // inferred from a whole-map painting. Compact alleys keep native roof strips.
    c.drawImage(illustration, x - 8, y - 8, w + 16, h + 24);
    return;
  }
  const samurai = id === "kage";
  rounded(c, x + 10, y + 17, w, h, 7, "#050e1c65");
  rounded(c, x, y + 10, w, h, 5, p.wall, "#111e29");
  // Visible facade, doors and window bands give buildings a deliberate scale.
  rounded(c, x + 9, y + h - 22, w - 18, 31, 3, samurai ? "#bc9c78" : "#182c38");
  for (let xx = x + 14; xx < x + w - 20; xx += 29) {
    rounded(
      c,
      xx,
      y + h - 15,
      19,
      15,
      2,
      index % 3 ? p.light : p.trim,
      "#132934",
    );
    line(
      c,
      [
        [xx + 9, y + h - 15],
        [xx + 9, y + h],
      ],
      "#3f565f",
      1,
    );
  }
  const roof = c.createLinearGradient(0, y, 0, y + h - 12);
  roof.addColorStop(0, p.roof);
  roof.addColorStop(1, samurai ? "#293f4b" : p.wall);
  rounded(
    c,
    x - (samurai ? 6 : 0),
    y - 3,
    w + (samurai ? 12 : 0),
    h - 20,
    samurai ? 9 : 4,
    roof,
    "#152632",
  );
  line(
    c,
    [
      [x + 2, y + 1],
      [x + w - 2, y + 1],
    ],
    "#b1c7c485",
    2,
  );
  if (samurai) {
    for (let yy = y + 9; yy < y + h - 23; yy += 11)
      line(
        c,
        [
          [x - 3, yy],
          [x + w + 3, yy],
        ],
        "#91a7aa55",
        1,
      );
    line(
      c,
      [
        [x - 10, y + h - 20],
        [x + w / 2, y + h - 13],
        [x + w + 10, y + h - 20],
      ],
      p.trim,
      3,
    );
    for (let xx = x + 12; xx < x + w; xx += 42) {
      ellipse(c, xx, y + h + 16, 7, 9, "#cc7871");
      line(
        c,
        [
          [xx, y + h + 5],
          [xx, y + h + 27],
        ],
        "#ffcdaa",
        1,
      );
    }
    // Curved eaves, tiled ridges and timber framing instead of generic blocks.
    const eave = y + h - 22;
    c.beginPath();
    c.moveTo(x - 14, eave - 8);
    c.quadraticCurveTo(x + w / 2, eave + 8, x + w + 14, eave - 8);
    c.lineTo(x + w + 10, eave + 1);
    c.quadraticCurveTo(x + w / 2, eave + 15, x - 10, eave + 1);
    c.closePath();
    c.fillStyle = "#28454b";
    c.fill();
    line(
      c,
      [
        [x - 14, eave - 8],
        [x - 10, eave + 1],
      ],
      "#acb7a2",
      2,
    );
    line(
      c,
      [
        [x + w + 14, eave - 8],
        [x + w + 10, eave + 1],
      ],
      "#acb7a2",
      2,
    );
    for (let xx = x + 16; xx < x + w; xx += 18)
      line(
        c,
        [
          [xx, y + 5],
          [xx, eave - 4],
        ],
        "#1d3b4333",
        1,
      );
    rounded(c, x + w / 2 - 10, y + h - 13, 20, 23, 2, "#3a4140", "#ded2ac");
    line(
      c,
      [
        [x + w / 2, y + h - 13],
        [x + w / 2, y + h + 10],
      ],
      "#c6ae88",
      1,
    );
    for (const dx of [6, w - 8])
      rounded(c, x + dx, y + h - 22, 3, 30, 1, "#5a4740");
    if (w > 190 && h > 90) {
      const roofY = y + h * 0.32;
      c.beginPath();
      c.moveTo(x + w * 0.15, roofY);
      c.lineTo(x + w / 2, y - 12);
      c.lineTo(x + w * 0.85, roofY);
      c.closePath();
      c.fillStyle = "#294751";
      c.fill();
      line(
        c,
        [
          [x + w * 0.15, roofY],
          [x + w / 2, y - 12],
          [x + w * 0.85, roofY],
        ],
        "#89a3a1",
        1.4,
      );
      line(
        c,
        [
          [x + w / 2 - 13, roofY - 4],
          [x + w / 2, y + 3],
          [x + w / 2 + 13, roofY - 4],
        ],
        "#cab991",
        2,
      );
    }
  } else {
    for (let xx = x + 17; xx < x + w - 15; xx += 51) {
      rounded(c, xx, y + 17, 28, 20, 3, "#17303c", "#749397");
      for (let i = 0; i < 4; i++)
        line(
          c,
          [
            [xx + 5, y + 22 + i * 3],
            [xx + 23, y + 22 + i * 3],
          ],
          "#719099",
          1,
        );
    }
    if (w > 85 && h > 45) {
      const signs =
        id === "citadel"
          ? ["CELL BLOCK", "RELAY / 07", "ARMOURY", "CARGO", "REACTOR"]
          : ["ATELIER", "ORBITAL", "NIGHT SHIFT", "CARGO", "CORE / 07"];
      rounded(c, x + 13, y + h - 33, Math.min(w - 26, 77), 15, 3, p.trim);
      c.fillStyle = "#17303c";
      c.font = "bold 8px sans-serif";
      c.textAlign = "left";
      c.fillText(signs[index % 5], x + 18, y + h - 23, w - 31);
    }
    if (w > 110 && h > 115) {
      rounded(c, x + w - 61, y + 40, 42, 34, 3, "#1a303c", "#68878c");
      for (const dx of [11, 31]) {
        ellipse(c, x + w - 61 + dx, y + 57, 8, 8, "#48656c");
        line(
          c,
          [
            [x + w - 61 + dx, y + 50],
            [x + w - 61 + dx, y + 64],
          ],
          "#1e3944",
          2,
        );
        line(
          c,
          [
            [x + w - 68 + dx, y + 57],
            [x + w - 54 + dx, y + 57],
          ],
          "#1e3944",
          2,
        );
      }
      line(
        c,
        [
          [x + 10, y + 42],
          [x + 10, y + h - 48],
          [x + w - 10, y + h - 48],
        ],
        "#729393",
        2,
      );
      line(
        c,
        [
          [x + 13, y + 42],
          [x + 13, y + h - 51],
          [x + w - 10, y + h - 51],
        ],
        "#132c36",
        2,
      );
      rounded(
        c,
        x + 24,
        y + 48,
        Math.min(58, w - 90),
        Math.min(45, h - 105),
        3,
        "#3e616c",
        "#192f3c",
      );
      for (let xx = x + 32; xx < x + Math.min(74, w - 66); xx += 10)
        line(
          c,
          [
            [xx, y + 52],
            [xx, y + Math.min(89, h - 62)],
          ],
          "#97b1b25e",
          1,
        );
    }
    if (id === "citadel") {
      line(
        c,
        [
          [x + w - 25, y + 40],
          [x + w - 10, y + 20],
        ],
        p.trim,
        4,
      );
      line(
        c,
        [
          [x + w - 25, y + 47],
          [x + w - 10, y + 27],
        ],
        p.trim,
        4,
      );
    }
  }
}
const authoredBuildings = {
  neon: [
    [65, 48, 116, 85],
    [201, 46, 146, 106],
    [514, 51, 238, 168],
    [777, 44, 85, 260],
    [1104, 30, 236, 65],
    [115, 266, 194, 25],
    [104, 17, 123, 24],
    [485, 249, 346, 80],
    [1040, 565, 172, 65],
    [1231, 565, 161, 85],
    [78, 575, 132, 64],
    [1440, 118, 65, 213],
    [667, 574, 137, 168],
  ],
  kage: [
    [178, 80, 153, 66],
    [88, 326, 231, 57],
    [450, 54, 58, 219],
    [648, 205, 159, 160],
    [701, 49, 224, 113],
    [1005, 168, 149, 187],
    [1155, 70, 251, 103],
    [112, 912, 47, 70],
    [648, 734, 218, 106],
    [1049, 506, 200, 95],
    [1090, 78, 62, 48],
  ],
  citadel: [
    [72, 70, 333, 154],
    [100, 299, 349, 178],
    [590, 171, 223, 151],
    [844, 59, 137, 265],
    [1090, 43, 375, 88],
    [99, 589, 115, 43],
    [682, 518, 282, 119],
    [661, 761, 278, 118],
    [1078, 561, 28, 260],
    [1210, 559, 44, 279],
  ],
};
function nearRoad(world, x, y, r = 22) {
  return world.walkAreas.some(
    ([px, py, w, h]) =>
      x > px / 2 - r &&
      x < (px + w) / 2 + r &&
      y > py / 2 - r &&
      y < (py + h) / 2 + r,
  );
}
function clearTerrain(world, x, y, radius = 25) {
  return (
    !nearRoad(world, x, y, radius) &&
    !authoredBuildings[world.id].some(
      ([bx, by, w, h]) =>
        x > bx - radius &&
        x < bx + w + radius &&
        y > by - radius &&
        y < by + h + radius,
    )
  );
}
function terrainDetails(c, world) {
  const kage = world.id === "kage";
  for (let i = 0; i < 170; i++) {
    const x = 22 + ((i * 0.61803398875) % 1) * 1490,
      y = 30 + ((i * 0.41421356237) % 1) * 955;
    if (!clearTerrain(world, x, y, 14)) continue;
    if (kage) {
      // Small grass clusters and worn stepping stones on coherent green ground.
      ellipse(c, x, y + 4, 12, 4, "#142d3226");
      for (let j = 0; j < 3; j++)
        line(
          c,
          [
            [x + j * 4, y + 4],
            [x + j * 4 - 2, y - 1 - (j % 2) * 3],
          ],
          "#77917370",
          1,
        );
      if (i % 4 === 0) {
        rounded(c, x - 11, y - 5, 18, 11, 5, "#73867a", "#324c48");
        line(
          c,
          [
            [x - 6, y - 4],
            [x + 3, y - 4],
          ],
          "#bdc0a880",
          1,
        );
      }
    } else {
      rounded(c, x - 9, y - 4, 18, 10, 2, "#112633", "#253b47");
      if (i % 3 === 0)
        line(
          c,
          [
            [x - 7, y - 2],
            [x + 6, y - 2],
          ],
          "#537481",
          1,
        );
    }
  }
  if (kage)
    for (const [x, y] of [
      [74, 225],
      [350, 119],
      [787, 533],
      [1170, 941],
      [1430, 491],
      [444, 790],
    ]) {
      if (!clearTerrain(world, x, y, 18)) continue;
      for (let j = 0; j < 6; j++) {
        const xx = x + j * 7,
          top = y - 36 - (j % 3) * 8;
        line(
          c,
          [
            [xx, y + 15],
            [xx + 3, top],
          ],
          "#799665",
          3,
        );
        for (let yy = top + 12; yy < y; yy += 14) {
          line(
            c,
            [
              [xx - 2, yy],
              [xx + 4, yy],
            ],
            "#b7c391",
            1,
          );
          line(
            c,
            [
              [xx + 2, yy],
              [xx + 11, yy - 6],
            ],
            "#537958",
            2,
          );
        }
      }
    }
}
export function drawWorldMap(c, world) {
  const p = palettes[world.id];
  c.save();
  c.scale(2, 2);
  c.fillStyle = p.ground;
  c.fillRect(0, 0, 1536, 1024);
  // Quiet terrain with large coherent areas; no random speckled noise.
  const sky = c.createLinearGradient(0, 0, 1536, 1024);
  sky.addColorStop(0, world.id === "kage" ? "#63836d" : "#233d4a");
  sky.addColorStop(1, p.ground);
  c.fillStyle = sky;
  c.fillRect(0, 0, 1536, 1024);
  terrainDetails(c, world);
  if (world.id === "neon") {
    rounded(c, 583, 572, 281, 460, 26, p.water, "#7da2ac");
    for (let y = 607; y < 1024; y += 21)
      line(
        c,
        [
          [593, y],
          [720, y + 3],
          [851, y],
        ],
        "#629db222",
        1,
      );
    rounded(c, 612, 582, 208, 132, 14, "#213940", "#0c2330");
  } else if (world.id === "kage") {
    for (const [x, y, w, h] of [
      [352, 715, 119, 144],
      [687, 805, 205, 124],
      [1125, 766, 173, 45],
    ])
      rounded(c, x, y, w, h, 22, p.water, "#a2bfb0");
    // Floating rock terraces, water and bamboo distinguish the samurai chapter.
    for (let i = 0; i < 50; i++) {
      const x = 54 + ((i * 191) % 1450),
        y = 51 + ((i * 131) % 920);
      if (clearTerrain(world, x, y, 40))
        tree(c, x, y, 20 + (i % 14), i % 3 === 0);
    }
  } else {
    for (const [x, y, w, h] of [
      [80, 920, 860, 90],
      [1094, 939, 350, 72],
      [699, 29, 122, 136],
    ]) {
      rounded(c, x, y, w, h, 17, "#703e45");
      rounded(c, x + 5, y + 8, w - 10, h - 13, 13, "#cc72553d");
    }
  }
  // Union paths before drawing the paving so intersections have no seam/curb.
  const streets = new Path2D();
  for (const [x, y, w, h] of world.walkAreas)
    streets.rect(x / 2, y / 2, w / 2, h / 2);
  c.strokeStyle = "#07162166";
  c.lineWidth = 16;
  c.stroke(streets);
  c.strokeStyle = p.edge;
  c.lineWidth = 3;
  c.stroke(streets);
  c.fillStyle = p.road;
  c.fill(streets);
  c.save();
  c.clip(streets);
  c.strokeStyle = world.id === "kage" ? "#7d95815e" : "#99b2b225";
  c.lineWidth = 0.65;
  const tile = world.id === "kage" ? 27 : 46;
  for (let y = 0; y < 1024; y += tile) {
    line(
      c,
      [
        [0, y],
        [1536, y],
      ],
      c.strokeStyle,
      0.65,
    );
    for (let x = ((Math.floor(y / tile) % 2) * tile) / 2; x < 1536; x += tile)
      line(
        c,
        [
          [x, y],
          [x, y + tile],
        ],
        c.strokeStyle,
        0.65,
      );
  }
  if (world.id === "neon") {
    c.strokeStyle = "#f1d19a99";
    c.setLineDash([15, 21]);
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(64, 515);
    c.lineTo(1490, 515);
    c.stroke();
    c.setLineDash([]);
    for (const x of [437, 999]) {
      c.fillStyle = "#c3d3ce6b";
      for (let i = 0; i < 6; i++) c.fillRect(x - 26, 480 + i * 9, 52, 4);
    }
  }
  c.restore();
  // Thin, consistent edge markings provide street scale without tiled noise.
  c.save();
  c.clip(streets);
  for (const [i, rect] of world.walkAreas.entries()) {
    const [x, y, w, h] = rect.map((n) => n / 2);
    if (w < 100 || h < 55 || i % 3 !== 0) continue;
    if (world.id === "kage") {
      for (let j = 0; j < 12; j++) {
        const xx = x + 14 + ((j * 13) % (w - 24)),
          yy = y + h - 10 - (j % 3) * 3;
        ellipse(c, xx, yy, 1.6, 0.8, "#b7829655");
      }
    } else {
      line(
        c,
        [
          [x + 12, y + h - 7],
          [x + w - 12, y + h - 7],
        ],
        "#87a6a53b",
        1.4,
      );
      if (w > 250) {
        c.fillStyle = "#8ca7b355";
        c.font = "bold 9px sans-serif";
        c.textAlign = "left";
        c.fillText(
          world.id === "neon" ? "LOADING ZONE / KEEP CLEAR" : "SECURITY ACCESS",
          x + 20,
          y + h - 15,
        );
      }
    }
  }
  c.restore();
  authoredBuildings[world.id].forEach((b, i) =>
    building(c, ...b, p, world.id, i),
  );
  // Landing zone and each district's landmark have authored, consistent motifs.
  for (let i = 0; i < world.districts.length; i++) {
    const d = world.districts[i],
      x = d.x / 2,
      y = d.y / 2;
    if (i === 0 || i === 4) {
      c.strokeStyle = i === 4 ? "#b9606470" : "#a9c8bc88";
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(x, y, i === 0 ? 58 : 44, i === 0 ? 39 : 34, 0, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.ellipse(x, y, i === 0 ? 47 : 34, i === 0 ? 31 : 25, 0, 0, Math.PI * 2);
      c.stroke();
    }
    if (world.id === "kage" && i === 3) {
      // Torii frame beside the path, not across the walkable lane.
      for (const dx of [-58, 58])
        rounded(c, x + dx, y - 30, 8, 58, 2, "#b96964");
      rounded(c, x - 74, y - 33, 157, 9, 3, "#723e4d");
      rounded(c, x - 65, y - 20, 139, 6, 2, "#ca8370");
    }
  }
  for (const [i, rect] of world.walkAreas.entries()) {
    const [xx, yy, ww, hh] = rect.map((n) => n / 2);
    if (Math.min(ww, hh) < 36) continue;
    const x = xx + 9,
      y = yy + 9;
    if (world.id === "kage") {
      line(
        c,
        [
          [x, y + 10],
          [x, y - 10],
        ],
        "#5c5d50",
        2,
      );
      ellipse(c, x, y - 12, 4, 6, "#edba84");
    } else {
      rounded(c, x, y, 6, 11, 2, "#1f3542", "#688e9a");
      rounded(c, x + 1, y - 2, 4, 3, 1, p.light);
    }
    // Benches face the street and retain generous walking space.
    if (i % 4 === 0 && ww > 150) {
      rounded(
        c,
        xx + ww - 38,
        yy + 8,
        24,
        7,
        2,
        world.id === "kage" ? "#907a62" : "#254453",
        "#91a2a1",
      );
      line(
        c,
        [
          [xx + ww - 34, yy + 15],
          [xx + ww - 34, yy + 19],
        ],
        "#132b38",
        2,
      );
    }
  }
  // Plant only off streets so scenery and the navigation agree.
  for (let i = 0; i < 32; i++) {
    const x = 45 + ((i * 137) % 1460),
      y = 80 + ((i * 223) % 866);
    if (clearTerrain(world, x, y, 35) && world.id !== "citadel")
      tree(c, x, y, 18 + Math.abs(noise(x, y)) * 10, world.id === "kage");
  }
  // Bridge railings are outside the traversable deck.
  if (world.id === "neon")
    for (const y of [779, 799])
      line(
        c,
        [
          [566, y],
          [973, y],
        ],
        "#8eb2b1",
        3,
      );
  c.restore();
}
export function worldMapCanvas(world) {
  if (!cache.has(world.id)) {
    const canvas = document.createElement("canvas");
    canvas.width = world.width;
    canvas.height = world.height;
    drawWorldMap(canvas.getContext("2d"), world);
    cache.set(world.id, { canvas });
  }
  return cache.get(world.id).canvas;
}
export function worldMapURL(world) {
  worldMapCanvas(world);
  const item = cache.get(world.id);
  return (item.url ??= item.canvas.toDataURL("image/webp", 0.92));
}
