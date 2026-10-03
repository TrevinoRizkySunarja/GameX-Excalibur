import { CHESS_PUZZLES, isQueenMate } from "./hack-catalog.js";
const shuffled = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const symbol = ["◇", "△", "○", "□", "✦", "⌁"];
export function mountExtra(
  type,
  { field, hint, done, onKey, later, animate, difficulty, click },
) {
  let misses = 0;
  const mistake = (message) => {
    misses++;
    hint(`${message} · ${misses}/3 fouten`);
    if (misses >= 3) done(false);
  };
  if (type === "rhythm") {
    field.innerHTML =
      '<div class="rhythm-area"><button class="rhythm-target" aria-label="Vang de puls"><i></i><span>1</span></button></div><p class="mini-help">Wacht op de ring · klik of SPATIE</p>';
    const b = field.querySelector("button"),
      ring = b.querySelector("i"),
      places = [
        [23, 35],
        [74, 64],
        [36, 70],
        [68, 28],
        [50, 50],
      ];
    let hits = 0,
      born = performance.now(),
      lastTry = 0;
    const cycle = () => {
      born = performance.now();
      const p = places[hits % 5];
      b.style.left = p[0] + "%";
      b.style.top = p[1] + "%";
      b.querySelector("span").textContent = hits + 1;
    };
    cycle();
    const duration = 1650 - difficulty * 70;
    const attempt = () => {
      const now = performance.now();
      if (now - lastTry < 250) return;
      lastTry = now;
      const age = now - born;
      if (age > duration - 320 && age < duration + 260) {
        hits++;
        click();
        hint(`${hits}/5 resonanties`);
        if (hits === 5) done(true);
        else cycle();
      } else mistake("Te vroeg. Wacht tot de ringen elkaar raken");
    };
    b.onclick = attempt;
    onKey((e) => {
      if (e.code === "Space") {
        e.preventDefault();
        attempt();
      }
    });
    animate((now) => {
      const age = now - born;
      ring.style.transform = `scale(${Math.max(0.85, 2.5 - (age / duration) * 1.5)})`;
      b.classList.toggle("ready", age > duration - 320 && age < duration + 260);
      if (age > duration + 300) {
        mistake("Puls gemist");
        cycle();
      }
    });
  } else if (type === "maze") {
    // Coordinates live in one fixed viewBox, independent of CSS/mobile scaling.
    const path = [
        [25, 190],
        [100, 190],
        [100, 62],
        [210, 62],
        [210, 168],
        [324, 168],
        [324, 60],
        [385, 60],
      ],
      width = 36;
    field.innerHTML = `<svg class="maze-board" viewBox="0 0 410 230" preserveAspectRatio="none" aria-label="Cursorparcours"><polyline class="maze-line" points="${path.map((p) => p.join(",")).join(" ")}"/><circle class="maze-goal" cx="385" cy="60" r="14"/><circle id="maze-cursor" cx="25" cy="190" r="7"/></svg><button id="maze-start" class="button accent">START</button><p class="mini-help">Blijf in het verlichte pad. Bij een fout ga je terug naar START.</p>`;
    const svg = field.querySelector("svg"),
      cursor = field.querySelector("#maze-cursor");
    let active = false,
      pos = [25, 190],
      checkpoint = 1;
    const distance = (p, a, b) => {
      const dx = b[0] - a[0],
        dy = b[1] - a[1],
        t = Math.max(
          0,
          Math.min(
            1,
            ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy),
          ),
        );
      return Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t);
    };
    const inside = (p) =>
      path.slice(1).some((b, i) => distance(p, path[i], b) < width / 2);
    const move = (next) => {
      if (!active) return;
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(next[0] - pos[0], next[1] - pos[1]) / 5),
      );
      for (let i = 1; i <= steps; i++) {
        const p = [
          pos[0] + ((next[0] - pos[0]) * i) / steps,
          pos[1] + ((next[1] - pos[1]) * i) / steps,
        ];
        if (!inside(p)) {
          active = false;
          mistake("Firewall geraakt. Start opnieuw");
          return;
        }
        if (
          checkpoint < path.length &&
          Math.hypot(p[0] - path[checkpoint][0], p[1] - path[checkpoint][1]) <
            18
        )
          checkpoint++;
      }
      pos = next;
      cursor.setAttribute("cx", pos[0]);
      cursor.setAttribute("cy", pos[1]);
      if (checkpoint === path.length) done(true);
    };
    field.querySelector("#maze-start").onclick = () => {
      pos = [25, 190];
      checkpoint = 1;
      active = true;
      cursor.setAttribute("cx", 25);
      cursor.setAttribute("cy", 190);
      hint("Start bij de lichtblauwe stip. Volg het pad.");
    };
    // Pointer input begins on the start dot to avoid a jump from the START button.
    let pointerLinked = false;
    svg.onpointermove = (e) => {
      const r = svg.getBoundingClientRect(),
        p = [
          ((e.clientX - r.left) / r.width) * 410,
          ((e.clientY - r.top) / r.height) * 230,
        ];
      if (!active) {
        pointerLinked = false;
        return;
      }
      if (!pointerLinked) {
        if (Math.hypot(p[0] - pos[0], p[1] - pos[1]) < 20) pointerLinked = true;
        else return;
      }
      move(p);
    };
    svg.onpointerdown = (e) => {
      svg.setPointerCapture(e.pointerId);
    };
    onKey((e) => {
      const dirs = {
        ArrowUp: [0, -7],
        ArrowDown: [0, 7],
        ArrowLeft: [-7, 0],
        ArrowRight: [7, 0],
      };
      if (dirs[e.key]) {
        e.preventDefault();
        move([pos[0] + dirs[e.key][0], pos[1] + dirs[e.key][1]]);
      }
    });
  } else if (type === "chess") {
    const p = CHESS_PUZZLES[Math.floor(Math.random() * CHESS_PUZZLES.length)];
    let selected = false;
    field.innerHTML = `<div class="chess-board" role="group" aria-label="Schaakbord">${Array.from(
      { length: 64 },
      (_, i) => {
        const sq = String.fromCharCode(97 + (i % 8)) + (8 - Math.floor(i / 8)),
          piece =
            sq === p.king
              ? "♔"
              : sq === p.queen
                ? "♕"
                : sq === p.enemy
                  ? "♚"
                  : "";
        return `<button data-square="${sq}" class="chess-cell ${((i % 8) + Math.floor(i / 8)) % 2 ? "dark" : "light"} ${sq === p.enemy ? "black-piece" : "white-piece"}" aria-label="${sq}${piece ? " " + piece : ""}">${piece}<small>${sq}</small></button>`;
      },
    ).join(
      "",
    )}</div><p class="mini-help">♔ jouw koning · ♕ jouw dame · ♚ tegenstander. De koning mag nergens veilig heen.</p>`;
    field.querySelectorAll("[data-square]").forEach(
      (b) =>
        (b.onclick = () => {
          if (b.dataset.square === p.queen) {
            selected = true;
            field
              .querySelectorAll(".selected")
              .forEach((n) => n.classList.remove("selected"));
            b.classList.add("selected");
            hint("Dame geselecteerd. Kies het matveld.");
          } else if (selected) {
            if (isQueenMate(p, b.dataset.square)) done(true);
            else {
              mistake("Dat is geen schaakmat. Zoek een veilig gedekt veld");
              selected = false;
              field
                .querySelectorAll(".selected")
                .forEach((n) => n.classList.remove("selected"));
            }
          } else hint("Selecteer eerst de witte dame ♕.");
        }),
    );
  } else if (type === "sequence") {
    const count = 9;
    let next = 1;
    field.innerHTML = `<div class="sequence-grid">${shuffled(
      Array.from({ length: count }, (_, i) => i + 1),
    )
      .map((n) => `<button data-number="${n}">${n}</button>`)
      .join("")}</div>`;
    field.querySelectorAll("button").forEach(
      (b) =>
        (b.onclick = () => {
          if (+b.dataset.number === next) {
            b.disabled = true;
            b.classList.add("solved");
            next++;
            click();
            hint(`${next - 1}/9 knooppunten`);
            if (next > count) done(true);
          } else mistake(`Je zoekt ${next}`);
        }),
    );
  } else if (type === "pipes") {
    // Six elbow pipes form a single zigzag. Start enters left; finish leaves right.
    const turns = [0, 0, 0, 0, 0, 0];
    const glyph = ["└", "┌", "┐", "┘"];
    field.innerHTML = `<div class="pipes-diagram"><span class="pipe-in">IN →</span><div class="pipe-grid">${turns.map((n, i) => `<button data-pipe="${i}" aria-label="Draai leiding ${i + 1}">${glyph[n]}</button>`).join("")}</div><span class="pipe-out">→ UIT</span></div><p class="mini-help">De route loopt IN → 1 ↓ 4 → 5 ↑ 2 → 3 ↓ 6 → UIT.</p><button id="pipe-check" class="button accent">Test de stroom</button>`;
    // Actual topology: [down,left], [up,right], [down,left], [up,right], [up,left], [up,right].
    const correct = [2, 1, 2, 0, 3, 0];
    turns.splice(0, 6, ...correct.map((n, i) => (n + 1 + (i % 2)) % 4));
    const buttons = [...field.querySelectorAll("[data-pipe]")];
    buttons.forEach((b, i) => {
      b.innerHTML = `${glyph[turns[i]]}<small>${i + 1}</small>`;
      b.onclick = () => {
        turns[i] = (turns[i] + 1) % 4;
        b.innerHTML = `${glyph[turns[i]]}<small>${i + 1}</small>`;
        click();
      };
    });
    field.querySelector("#pipe-check").onclick = () => {
      if (turns.every((v, i) => v === correct[i])) done(true);
      else mistake("Er lekt data. Controleer alle bochten");
    };
  } else if (type === "frequency") {
    const targets = [
      20 + Math.floor(Math.random() * 4) * 10,
      40 + Math.floor(Math.random() * 4) * 10,
      20 + Math.floor(Math.random() * 6) * 10,
    ];
    field.innerHTML = `<div class="frequency-controls">${targets.map((t, i) => `<label>KANAAL ${i + 1}<span>Doel <b>${t}</b> Hz · nu <output>50</output> Hz</span><input data-frequency="${i}" type="range" min="0" max="100" step="5" value="50" aria-label="Frequentie ${i + 1}"/><i style="left:${t}%"></i></label>`).join("")}</div><button id="frequency-check" class="button accent">Synchroniseren</button>`;
    const sliders = [...field.querySelectorAll("input")];
    sliders.forEach(
      (s) =>
        (s.oninput = () =>
          (s.parentElement.querySelector("output").value = s.value)),
    );
    field.querySelector("button").onclick = () => {
      if (sliders.every((s, i) => Math.abs(+s.value - targets[i]) <= 5))
        done(true);
      else mistake("De kanalen liggen buiten de veilige marge");
    };
  } else if (type === "keypad") {
    const code = Array.from({ length: 4 + (difficulty % 2) }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    let input = "",
      ready = false;
    field.innerHTML = `<div class="code-display" id="code-display">${code}</div><span class="mini-help" id="code-phase">Onthoud de toegangscode…</span><div class="keypad-grid">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "↵"].map((n) => `<button data-key="${n}">${n}</button>`).join("")}</div>`;
    const display = field.querySelector("#code-display");
    later(() => {
      ready = true;
      display.textContent = "•".repeat(code.length);
      field.querySelector("#code-phase").textContent =
        "Voer de code in en bevestig met ↵";
    }, 3500);
    const press = (key) => {
      if (!ready) return;
      if (key === "⌫") input = input.slice(0, -1);
      else if (key === "↵") {
        if (input === code) done(true);
        else {
          mistake("Code onjuist");
          input = "";
        }
      } else if (input.length < code.length) input += key;
      display.textContent = input.padEnd(code.length, "_");
    };
    field
      .querySelectorAll("button")
      .forEach((b) => (b.onclick = () => press(b.dataset.key)));
    onKey((e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      if (e.key === "Backspace") {
        e.preventDefault();
        press("⌫");
      }
      if (e.key === "Enter") {
        e.preventDefault();
        press("↵");
      }
    });
  } else if (type === "asteroids") {
    field.innerHTML = `<div class="asteroid-field">${Array.from({ length: 10 }, (_, i) => `<button class="space-target ${i < 7 ? "hostile" : "friendly"}" data-target="${i}" aria-label="${i < 7 ? "Dreiging" : "Satelliet"} ${i + 1}">${i < 7 ? "✦" : "◇"}</button>`).join("")}</div><p class="mini-help">7 rode dreigingen · blauwe satellieten beschermen</p>`;
    let count = 0;
    const buttons = [...field.querySelectorAll("button")];
    buttons.forEach(
      (b, i) =>
        (b.onclick = () => {
          if (i < 7) {
            count++;
            b.disabled = true;
            b.style.visibility = "hidden";
            click();
            hint(`${count}/7 dreigingen verwijderd`);
            if (count === 7) done(true);
          } else mistake("Vriendelijke satelliet geraakt");
        }),
    );
    animate((now) =>
      buttons.forEach((b, i) => {
        b.style.left = `${12 + (i % 5) * 18 + Math.sin(now / 1000 + i) * 5}%`;
        b.style.top = `${28 + Math.floor(i / 5) * 45 + Math.cos(now / 1100 + i) * 9}%`;
      }),
    );
  } else if (type === "clean") {
    field.innerHTML = `<div class="filter-board"><div class="filter-items">${["◈", "◉", "▰", "◬", "✣", "▨"].map((s, i) => `<button draggable="true" data-trash="${i}" aria-label="Afval ${i + 1}">${s}</button>`).join("")}</div><button id="filter-bin">↓<span>OPVANGBAK</span></button></div><p class="mini-help">Slepen, of selecteer één stuk afval en klik de opvangbak.</p>`;
    let selected = null,
      count = 0;
    const bin = field.querySelector("#filter-bin");
    const select = (b) => {
      selected = b;
      field
        .querySelectorAll("[data-trash]")
        .forEach((x) => x.classList.toggle("selected", x === b));
    };
    const drop = () => {
      if (!selected || selected.disabled) return;
      selected.disabled = true;
      selected.style.visibility = "hidden";
      selected = null;
      count++;
      click();
      hint(`${count}/6 filterdelen schoon`);
      if (count === 6) done(true);
    };
    field.querySelectorAll("[data-trash]").forEach((b) => {
      b.onclick = () => select(b);
      b.ondragstart = (e) => {
        select(b);
        e.dataTransfer.setData("text/plain", b.dataset.trash);
      };
    });
    bin.ondragover = (e) => e.preventDefault();
    bin.ondrop = (e) => {
      e.preventDefault();
      drop();
    };
    bin.onclick = drop;
  } else if (type === "balance") {
    field.innerHTML =
      '<div class="balance-track"><span></span><i id="balance-needle"></i></div><div class="balance-buttons"><button id="balance-left">← ONTLADEN <kbd>A</kbd></button><button id="balance-right">OPLADEN → <kbd>D</kbd></button></div><p class="mini-help">Blijf in de middelste zone tot 100% stabiliteit.</p><div class="balance-progress"><i></i></div>';
    let value = 50,
      progress = 0,
      last = performance.now();
    const change = (v) => {
      value = Math.max(0, Math.min(100, value + v));
      click();
    };
    field.querySelector("#balance-left").onclick = () => change(-8);
    field.querySelector("#balance-right").onclick = () => change(8);
    onKey((e) => {
      if (["KeyA", "ArrowLeft", "KeyD", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
        change(["KeyA", "ArrowLeft"].includes(e.code) ? -8 : 8);
      }
    });
    animate((now) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      value += Math.sin(now / 1100) * dt * 19 + dt * 5;
      value = Math.max(0, Math.min(100, value));
      progress = Math.max(
        0,
        Math.min(100, progress + dt * (value > 33 && value < 67 ? 16 : -12)),
      );
      field.querySelector("#balance-needle").style.left = value + "%";
      field.querySelector(".balance-progress i").style.width = progress + "%";
      hint(`Stabiliteit: ${Math.round(progress)}%`);
      if (progress >= 100) done(true);
    });
  } else if (type === "locks") {
    const target = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 6),
      ),
      current = target.map((n, i) => (n + i + 1) % 6);
    field.innerHTML = `<div class="lock-target" aria-label="Voorbeeldcode">${target.map((n) => symbol[n]).join(" ")}</div><div class="lock-dials">${current.map((n, i) => `<button data-dial="${i}" aria-label="Draai schijf ${i + 1}">${symbol[n]}</button>`).join("")}</div><button id="unlock-check" class="button accent">Ontgrendel</button>`;
    field.querySelectorAll("[data-dial]").forEach(
      (b, i) =>
        (b.onclick = () => {
          current[i] = (current[i] + 1) % 6;
          b.textContent = symbol[current[i]];
          click();
        }),
    );
    field.querySelector("#unlock-check").onclick = () => {
      if (current.every((n, i) => n === target[i])) done(true);
      else mistake("De symbolen komen nog niet overeen");
    };
  }
}
