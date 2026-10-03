// Coordinates are authored against the 1536 × 1024 paintings, then scaled ×2.
// Walkable rectangles describe ground and bridge decks; roofs and water stay solid.
const layouts = {
  neon: {
    spawn: [305, 820],
    districts: [
      [300, 765, "Wayfarer Dock"],
      [228, 365, "De Avondmarkt"],
      [240, 195, "Koperkwartier"],
      [686, 402, "Signaalplein"],
      [1235, 220, "Vrachthaven"],
      [1200, 905, "Bloesemkwartier"],
    ],
    paths: [
      [50, 473, 1460, 80],
      [394, 12, 86, 490],
      [870, 229, 93, 258],
      [963, 20, 72, 937],
      [98, 328, 299, 139],
      [135, 298, 220, 43],
      [115, 175, 220, 70],
      [188, 233, 54, 100],
      [475, 375, 397, 64],
      [615, 344, 125, 57],
      [1150, 106, 194, 225],
      [1125, 321, 96, 116],
      [1040, 398, 361, 60],
      [1180, 393, 111, 119],
      [1068, 150, 100, 107],
      [110, 655, 333, 238],
      [232, 552, 116, 118],
      [480, 540, 80, 390],
      [406, 863, 134, 67],
      [527, 767, 490, 46],
      [1025, 868, 413, 87],
      [1030, 657, 113, 281],
      [1130, 825, 320, 62],
      [1242, 694, 184, 149],
      [1124, 644, 164, 64],
    ],
    positions: {
      "neon-ship": [275, 775],
      ilo: [228, 400],
      "neon-relay": [680, 390],
      "neon-boss": [1248, 206],
      "neon-drone": [795, 510],
      "neon-cache": [285, 206],
      "neon-secret": [1340, 780],
      "neon-stars-a": [368, 722],
      "neon-stars-b": [660, 502],
    },
    routes: {
      ilo: [
        [220, 400],
        [275, 405],
        [260, 355],
        [208, 360],
      ],
      "neon-drone": [
        [790, 512],
        [842, 514],
      ],
    },
    residents: [
      [
        "mira",
        "Mira · monteur",
        252,
        194,
        "amber",
        [
          [252, 194],
          [290, 212],
          [175, 204],
        ],
        "Mijn onderdelen liggen bij de brug. Zonder die zekeringen krijg ik geen schip meer de lucht in.",
        "neon-repair",
      ],
      [
        "nori",
        "Nori · nachtkoerier",
        452,
        461,
        "violet",
        [
          [449, 461],
          [448, 305],
          [445, 150],
        ],
        "De piraten sluiten de stad af. Ik blijf bezorgen. Iemand moet de mensen bereiken.",
      ],
      [
        "aya",
        "Aya · botanist",
        1280,
        895,
        "green",
        [
          [1280, 895],
          [1150, 909],
          [1060, 901],
        ],
        "Zelfs hier groeit iets. Help me de irrigatie weer aan te zetten.",
        "neon-garden",
      ],
      [
        "juno",
        "Juno · archiefduiker",
        685,
        407,
        "blue",
        [
          [685, 407],
          [808, 412],
          [724, 402],
        ],
        "In elke wijk ligt een herinnering. Bekijk je stadskaart met L.",
      ],
      [
        "pix",
        "PIX · bezorgrobot",
        1145,
        494,
        "robot",
        [
          [1145, 494],
          [1370, 501],
          [1210, 519],
        ],
        "Pakket gevonden. Ontvanger: onbekend. Typisch NEON.",
      ],
      [
        "sol",
        "Sol · reiziger",
        338,
        708,
        "violet",
        [
          [338, 708],
          [212, 701],
          [206, 840],
          [362, 847],
        ],
        "De Wayfarer? Die motoren herken ik uit de oude dagen.",
      ],
      [
        "rhea",
        "Rhea · handelaar",
        185,
        376,
        "red",
        [
          [185, 376],
          [185, 427],
          [321, 423],
        ],
        "Stars kopen onderdelen. Vertrouwen moet je verdienen.",
      ],
      [
        "orin",
        "Orin · havenwerker",
        1190,
        301,
        "amber",
        [
          [1190, 301],
          [1297, 302],
          [1295, 164],
          [1192, 165],
        ],
        "K-9 heeft het manifest. Let op de patrouilles in de haven.",
      ],
    ],
    extras: [
      ["neon-repair", "sidehack", 550, 790, "Koelbrug-zekeringen"],
      ["neon-garden", "sidehack", 1290, 725, "Irrigatiecontroller"],
      ["neon-arcade", "practice", 160, 407, "Omni-oefenstation"],
      ["neon-cache-2", "chest", 140, 214, "Werkplaatskist"],
      ["neon-cache-3", "chest", 1390, 914, "Vracht uit het kanaal"],
      ["neon-cache-4", "chest", 1100, 200, "Havencontainer"],
      ["neon-drone-2", "enemy", 990, 713, "Kanaalpatrouille"],
      ["neon-drone-3", "enemy", 1138, 367, "Vrachtverkenner"],
    ],
    loot: [
      [320, 415],
      [438, 340],
      [845, 493],
      [928, 482],
      [995, 602],
      [720, 791],
      [1064, 899],
      [1210, 890],
      [1260, 135],
      [538, 890],
    ],
  },
  kage: {
    spawn: [275, 797],
    districts: [
      [250, 795, "Sterrenlanding"],
      [265, 490, "Lantaarnmarkt"],
      [580, 400, "Bamboepad"],
      [860, 376, "Ankertempel"],
      [1300, 275, "Vanes Heiligdom"],
      [1180, 849, "Bloesemtuin"],
    ],
    paths: [
      [100, 670, 335, 204],
      [183, 566, 140, 116],
      [173, 869, 113, 101],
      [472, 596, 102, 330],
      [285, 886, 255, 75],
      [184, 466, 349, 72],
      [184, 396, 125, 107],
      [164, 164, 151, 105],
      [269, 220, 175, 58],
      [379, 262, 66, 88],
      [439, 300, 116, 90],
      [520, 34, 90, 573],
      [534, 401, 938, 77],
      [820, 339, 110, 95],
      [1200, 207, 200, 163],
      [1250, 355, 95, 101],
      [667, 576, 274, 65],
      [548, 566, 180, 57],
      [575, 475, 77, 166],
      [872, 606, 150, 67],
      [939, 482, 96, 233],
      [1000, 681, 430, 83],
      [1299, 706, 75, 202],
      [1083, 819, 268, 73],
      [948, 827, 170, 160],
      [575, 975, 465, 36],
      [537, 860, 86, 143],
    ],
    positions: {
      "kage-ship": [251, 790],
      ren: [541, 510],
      kaito: [952, 449],
      "kage-anchor": [866, 389],
      "kage-boss": [1300, 272],
      "kage-drone": [566, 185],
      "kage-cache": [267, 201],
      "kage-secret": [1290, 858],
      "kage-stars": [560, 367],
    },
    routes: {
      ren: [
        [541, 510],
        [550, 459],
        [569, 484],
      ],
      kaito: [
        [957, 449],
        [1035, 449],
        [986, 433],
      ],
      "kage-drone": [
        [566, 185],
        [567, 275],
      ],
    },
    residents: [
      [
        "hana",
        "Hana · tuinier",
        1160,
        850,
        "violet",
        [
          [1160, 850],
          [1284, 850],
          [1210, 868],
        ],
        "Het anker heeft de waterstroom gebroken. Herstel de tuinpomp.",
        "kage-water",
      ],
      [
        "taro",
        "Taro · pelgrim",
        267,
        507,
        "amber",
        [
          [267, 507],
          [382, 500],
          [430, 490],
        ],
        "Ren denkt aan onze kinderen. Kaito denkt aan vandaag.",
      ],
      [
        "yui",
        "Yui · monnik",
        882,
        437,
        "blue",
        [
          [882, 437],
          [760, 439],
          [704, 448],
        ],
        "Oefening maakt de hand rustig. Ook een Omni-Tool vraagt geduld.",
      ],
      [
        "zen",
        "Zen · wachter",
        1262,
        297,
        "red",
        [
          [1262, 297],
          [1339, 300],
          [1339, 237],
          [1260, 237],
        ],
        "Vane noemt deze plek zijn fort. Wij noemen het nog steeds thuis.",
      ],
    ],
    extras: [
      ["kage-water", "sidehack", 1020, 709, "Tempelwaterpomp"],
      ["kage-arcade", "practice", 353, 499, "Resonantie-oefensteen"],
      ["kage-cache-2", "chest", 525, 823, "Verloren reizigerskist"],
      ["kage-cache-3", "chest", 1440, 450, "Torii-voorraad"],
      ["kage-drone-2", "enemy", 1150, 446, "Ronin-drone"],
    ],
    loot: [
      [260, 602],
      [540, 695],
      [561, 291],
      [697, 444],
      [792, 608],
      [1025, 745],
      [1330, 796],
      [1140, 738],
    ],
  },
  citadel: {
    spawn: [217, 815],
    districts: [
      [216, 789, "De Laatste Landing"],
      [259, 527, "Cellenblok 07"],
      [553, 180, "Reactorstraat"],
      [779, 395, "Keizerlijke Kern"],
      [1310, 215, "Troonarena"],
      [1164, 899, "Het Geheugenarchief"],
    ],
    paths: [
      [107, 728, 244, 146],
      [160, 642, 137, 99],
      [231, 574, 65, 103],
      [50, 515, 521, 55],
      [491, 255, 66, 643],
      [31, 250, 469, 35],
      [505, 145, 62, 152],
      [522, 72, 93, 88],
      [571, 355, 425, 70],
      [530, 429, 979, 68],
      [997, 24, 56, 425],
      [1107, 158, 340, 138],
      [1217, 282, 183, 75],
      [1253, 346, 88, 117],
      [562, 656, 510, 55],
      [572, 692, 45, 181],
      [353, 829, 218, 55],
      [1119, 519, 67, 382],
      [1277, 515, 53, 390],
      [1330, 714, 188, 33],
      [1073, 876, 437, 34],
      [966, 702, 104, 193],
    ],
    positions: {
      "citadel-ship": [207, 790],
      "citadel-core": [775, 387],
      "citadel-boss": [1300, 215],
      "citadel-drone": [700, 465],
      "citadel-cache": [245, 533],
      "citadel-secret": [1448, 734],
      "citadel-stars": [450, 533],
    },
    routes: {
      "citadel-drone": [
        [700, 465],
        [882, 465],
      ],
    },
    residents: [
      [
        "dr-vale",
        "Dr. Vale · ontsnapte technicus",
        1090,
        467,
        "blue",
        [
          [1090, 467],
          [1163, 469],
          [1152, 529],
        ],
        "De medische deur is nog dicht. Er zitten mensen achter.",
        "citadel-cells",
      ],
      [
        "sera",
        "Sera · gevangene",
        251,
        534,
        "violet",
        [
          [251, 534],
          [330, 535],
          [400, 535],
        ],
        "Je ouders hielden de moed erin. Ze wisten dat je nog leefde.",
      ],
      [
        "echo",
        "ECHO · defecte drone",
        1025,
        781,
        "robot",
        [
          [1025, 781],
          [1024, 849],
          [995, 835],
        ],
        "Opdracht: beschermen. Doel: iedereen. Nieuwe opdracht aanvaard.",
      ],
    ],
    extras: [
      ["citadel-cells", "sidehack", 1162, 615, "Medische celdeur"],
      ["citadel-arcade", "practice", 315, 542, "Gekaapte simulatieterminal"],
      ["citadel-cache-2", "chest", 1152, 809, "Piratenmagazijn"],
      ["citadel-cache-3", "chest", 548, 171, "Reactorbenodigdheden"],
      ["citadel-drone-2", "enemy", 1289, 548, "Zware magazijnwacht"],
      ["citadel-drone-3", "enemy", 545, 340, "Keizerlijke scan-unit"],
    ],
    loot: [
      [272, 715],
      [522, 750],
      [680, 683],
      [811, 462],
      [1026, 357],
      [1154, 700],
      [1298, 834],
      [1410, 892],
    ],
  },
};
export const SIDE_QUESTS = {
  "neon-repair": {
    name: "Een stad in beweging",
    npc: "Mira",
    reward: 45,
    description: "Herstel de koelbrug-zekeringen en meld je terug bij Mira.",
  },
  "neon-garden": {
    name: "Bloei tussen beton",
    npc: "Aya",
    reward: 40,
    description:
      "Hack de irrigatiecontroller en vertel Aya dat de tuin weer water krijgt.",
  },
  "kage-water": {
    name: "Het water herinnert",
    npc: "Hana",
    reward: 45,
    description: "Herstel de tempelwaterpomp en keer terug naar Hana.",
  },
  "citadel-cells": {
    name: "Niemand achterlaten",
    npc: "Dr. Vale",
    reward: 60,
    description: "Open de medische celdeur en meld je terug bij Dr. Vale.",
  },
};
export function expandWorlds(worlds) {
  for (const [id, w] of Object.entries(worlds)) {
    const l = layouts[id];
    w.width = 3072;
    w.height = 2048;
    w.art = `art/worlds/${id}.webp`;
    w.spawn = l.spawn.map((n) => n * 2);
    w.walkAreas = l.paths.map((r) => r.map((n) => n * 2));
    w.obstacles = [];
    w.districts = l.districts.map(([x, y, name]) => ({
      x: x * 2,
      y: y * 2,
      name,
    }));
    for (const o of w.objects) {
      [o.x, o.y] = l.positions[o.id].map((n) => n * 2);
      if (l.routes[o.id])
        o.route = l.routes[o.id].map((p) => p.map((n) => n * 2));
      if (o.id === "ilo") o.style = "robot";
      if (o.id === "kaito") o.style = "red";
    }
    for (const [short, name, x, y, style, route, line, quest] of l.residents)
      w.objects.push({
        id: `${id}-${short}`,
        name,
        x: x * 2,
        y: y * 2,
        type: "npc",
        style,
        route: route.map((p) => p.map((n) => n * 2)),
        line,
        quest,
        hint: `Spreek ${name.split(" · ")[0]}`,
        portrait: id === "kage" ? 4 : 1,
      });
    for (const [oid, type, x, y, name] of l.extras)
      w.objects.push({
        id: oid,
        type,
        x: x * 2,
        y: y * 2,
        name,
        hint:
          type === "enemy"
            ? "Start een hackgevecht"
            : type === "chest"
              ? "Open de kist"
              : type === "practice"
                ? "Oefen een willekeurige hack"
                : `Hack ${name.toLowerCase()}`,
        hp: 55 + Number(w.chapter) * 10,
        damage: 10 + Number(w.chapter) * 2,
      });
    l.loot.forEach(([x, y], i) =>
      w.objects.push({
        id: `${id}-extra-stars-${i}`,
        type: "loot",
        x: x * 2,
        y: y * 2,
        name: "Stars",
      }),
    );
  }
}
export function addStoryTargets(worlds) {
  const targets = {
    neon: [
      ["neon-grid-north", 438, 340, "Noordelijke stroomverdeler"],
      ["neon-grid-south", 1360, 914, "Tuinverdeler"],
      ["neon-postbox", 804, 402, "Verzegeld postpakket"],
    ],
    kage: [
      ["kage-bell-west", 566, 345, "Westelijke resonantieklok"],
      ["kage-bell-east", 1145, 736, "Oostelijke resonantieklok"],
    ],
    citadel: [
      ["citadel-beacon-west", 359, 540, "Noodbaken cellenblok"],
      ["citadel-beacon-east", 1425, 891, "Noodbaken archief"],
      ["citadel-memory-a", 551, 116, "Geheugenkern Alpha"],
      ["citadel-memory-b", 989, 848, "Geheugenkern Omega"],
    ],
  };
  for (const [world, items] of Object.entries(targets))
    for (const [id, x, y, name] of items)
      worlds[world].objects.push({
        id,
        type: "sidehack",
        x: x * 2,
        y: y * 2,
        name,
        hint: "Hack " + name.toLowerCase(),
      });
  const routes = {
    "neon-sol": [
      [338, 708],
      [228, 400],
      [680, 412],
      [1150, 909],
    ],
    "kage-taro": [
      [267, 507],
      [250, 797],
      [860, 439],
      [1140, 738],
    ],
    "citadel-echo": [
      [1025, 781],
      [779, 405],
      [251, 534],
      [1154, 700],
    ],
  };
  for (const w of Object.values(worlds))
    for (const o of w.objects) {
      if (routes[o.id]) {
        o.route = routes[o.id].map((p) => p.map((n) => n * 2));
        o.wandering = true;
      }
      if (
        [
          "neon-rhea",
          "neon-sol",
          "kage-yui",
          "kage-taro",
          "citadel-dr-vale",
          "citadel-echo",
        ].includes(o.id)
      )
        o.trader = true;
    }
}
export function walkable(world, x, y, radius = 0) {
  return [
    [x - radius, y - radius],
    [x + radius, y - radius],
    [x - radius, y + radius],
    [x + radius, y + radius],
  ].every(([px, py]) =>
    world.walkAreas.some(
      ([rx, ry, w, h]) => px >= rx && px <= rx + w && py >= ry && py <= ry + h,
    ),
  );
}
// Small deterministic navigation grid. Click-to-move follows streets around buildings.
export function routeTo(world, from, to, cell = 24) {
  const cols = Math.ceil(world.width / cell),
    rows = Math.ceil(world.height / cell);
  const point = (index) => ({
    x: (index % cols) * cell + cell / 2,
    y: Math.floor(index / cols) * cell + cell / 2,
  });
  const index = (p) => Math.floor(p.y / cell) * cols + Math.floor(p.x / cell);
  const valid = (i) =>
    i >= 0 && i < cols * rows && walkable(world, point(i).x, point(i).y, 8);
  const nearest = (p) => {
    let best = -1,
      dist = Infinity;
    for (let y = -5; y <= 5; y++)
      for (let x = -5; x <= 5; x++) {
        const i = index(p) + y * cols + x;
        if (valid(i)) {
          const q = point(i),
            d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
          if (d < dist) {
            best = i;
            dist = d;
          }
        }
      }
    return best;
  };
  const start = nearest(from),
    end = nearest(to);
  if (start < 0 || end < 0) return [];
  const queue = [start],
    came = new Map([[start, -1]]);
  let cursor = 0;
  while (cursor < queue.length) {
    const i = queue[cursor++];
    if (i === end) break;
    for (const next of [i - 1, i + 1, i - cols, i + cols]) {
      if (
        came.has(next) ||
        !valid(next) ||
        Math.abs((next % cols) - (i % cols)) > 1
      )
        continue;
      came.set(next, i);
      queue.push(next);
    }
  }
  if (!came.has(end)) return [];
  const path = [];
  for (let at = end; at !== start; at = came.get(at)) path.push(point(at));
  path.reverse();
  return path.filter(
    (p, i) =>
      i === 0 ||
      i === path.length - 1 ||
      (path[i - 1].x !== path[i + 1].x && path[i - 1].y !== path[i + 1].y),
  );
}
