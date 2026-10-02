import { click, success, fail } from "./audio.js";
const symbols = ["◇", "△", "○", "□"];
const configs = {
  timing: [
    "Signaal vergrendelen",
    "Stop de indicator in het verlichte venster.",
    "TIMING",
  ],
  nodes: [
    "Datapulsen volgen",
    "Klik de vijf pulsen in volgorde: 1 → 5.",
    "REACTIE",
  ],
  memory: [
    "Patroon reconstrueren",
    "Onthoud de reeks en voer hem daarna opnieuw in.",
    "GEHEUGEN",
  ],
  wires: [
    "Verbinding herstellen",
    "Verbind elke linker aansluiting met hetzelfde symbool rechts.",
    "LOGICA",
  ],
  logic: [
    "Oorzaak & gevolg",
    "Kies de combinatie die de gevraagde reactie veroorzaakt.",
    "COMBINATIE",
  ],
};
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export function mountHack(type, world, difficulty, onResult) {
  const root = document.querySelector("#hack-body");
  const [name, instruction, category] = configs[type];
  root.innerHTML = `<div class="hack-heading"><span class="eyebrow">${category} / WILLEKEURIGE OPDRACHT</span><h2>${name}</h2><p>${instruction}</p></div><div id="minigame" class="minigame"></div><div class="hack-clock"><div id="clock-fill"></div></div><div class="hack-meta"><span id="hack-feedback">Maak verbinding met het netwerk.</span><span id="hack-seconds"></span></div>`;
  const field = root.querySelector("#minigame"),
    feedback = root.querySelector("#hack-feedback"),
    clock = root.querySelector("#clock-fill");
  let finished = false,
    raf,
    interval,
    seconds = 18 + Math.max(0, 3 - difficulty) * 2,
    start = performance.now(),
    extras = [];
  const done = (ok) => {
    if (finished) return;
    finished = true;
    cleanup();
    (ok ? success : fail)();
    feedback.textContent = ok
      ? "Verbinding succesvol. Realiteit herschreven."
      : "Link verbroken. Het systeem reageert.";
    onResult(ok);
  };
  const hint = (txt) => {
    feedback.textContent = txt;
  };
  const keyHandlers = [];
  const onKey = (fn) => {
    const h = (e) => {
      if (e.repeat || finished) return;
      fn(e);
    };
    window.addEventListener("keydown", h);
    keyHandlers.push(h);
  };
  function cleanup() {
    cancelAnimationFrame(raf);
    clearInterval(interval);
    extras.forEach(clearTimeout);
    keyHandlers.forEach((h) => window.removeEventListener("keydown", h));
  }
  interval = setInterval(() => {
    const remaining = seconds - (performance.now() - start) / 1000;
    clock.style.width = `${Math.max(0, remaining / seconds) * 100}%`;
    root.querySelector("#hack-seconds").textContent =
      `${Math.ceil(Math.max(0, remaining))} SEC`;
    if (remaining <= 0) done(false);
  }, 50);
  if (type === "timing") {
    const left = 0.32,
      right = 0.68;
    field.innerHTML = `<div class="timing-symbol">${world === "kage" ? "刃" : "⌁"}</div><div class="timing-track"><div class="timing-zone" style="left:32%;width:36%"></div><div id="timing-needle"></div></div><button id="timing-stop" class="button accent">Signaal vastzetten <kbd>SPATIE</kbd></button><p class="mini-help">Klik of druk op spatie in het verlichte venster.</p>`;
    let pos = 0;
    const frame = (now) => {
      pos = (Math.sin((now - start) / 480) + 1) / 2;
      field.querySelector("#timing-needle").style.left = `${pos * 100}%`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const stop = () => done(pos >= left && pos <= right);
    field.querySelector("#timing-stop").onclick = stop;
    onKey((e) => {
      if (e.code === "Space") {
        e.preventDefault();
        stop();
      }
    });
    hint("Wacht op het verlichte gebied.");
  } else if (type === "nodes") {
    field.innerHTML = '<div class="node-area"></div>';
    const area = field.firstElementChild;
    let next = 1;
    const positions = shuffle([
      [15, 25],
      [45, 65],
      [75, 28],
      [26, 73],
      [80, 72],
    ]);
    positions.forEach(([x, y], i) => {
      const b = document.createElement("button");
      b.className = "pulse-node";
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.textContent = String(i + 1);
      b.setAttribute("aria-label", `Puls ${i + 1}`);
      b.onclick = () => {
        if (i + 1 !== next) {
          hint(`Volg de volgorde. Je zoekt puls ${next}.`);
          return;
        }
        click();
        b.classList.add("hit");
        b.disabled = true;
        next++;
        hint(`${next - 1} / 5 pulsen verbonden`);
        if (next === 6) done(true);
      };
      area.append(b);
    });
    hint("Begin bij puls 1.");
  } else if (type === "memory") {
    const sequence = Array.from({ length: 3 + Math.min(2, difficulty) }, () =>
      Math.floor(Math.random() * 4),
    );
    let phase = "show",
      index = 0;
    field.innerHTML = `<div class="memory-grid">${symbols.map((s, i) => `<button data-memory="${i}" aria-label="Symbool ${i + 1}">${s}<small>${i + 1}</small></button>`).join("")}</div><p class="mini-help" id="memory-phase">Kijk naar de reeks…</p>`;
    const buttons = [...field.querySelectorAll("button")];
    sequence.forEach((value, i) => {
      extras.push(
        setTimeout(
          () => {
            buttons[value].classList.add("lit");
            toneOnce();
            extras.push(
              setTimeout(() => buttons[value].classList.remove("lit"), 400),
            );
          },
          600 + i * 650,
        ),
      );
    });
    extras.push(
      setTimeout(
        () => {
          phase = "input";
          hint("Jouw beurt.");
          field.querySelector("#memory-phase").textContent =
            "Herhaal de reeks. Klik of gebruik 1–4.";
        },
        600 + sequence.length * 650,
      ),
    );
    const input = (i) => {
      if (phase !== "input") return;
      if (i !== sequence[index]) {
        done(false);
        return;
      }
      click();
      index++;
      hint(`${index} / ${sequence.length} symbolen correct`);
      if (index === sequence.length) done(true);
    };
    buttons.forEach((b, i) => (b.onclick = () => input(i)));
    onKey((e) => {
      if (["1", "2", "3", "4"].includes(e.key)) input(Number(e.key) - 1);
    });
  } else if (type === "wires") {
    const order = shuffle([0, 1, 2]);
    let selected = null,
      count = 0;
    field.innerHTML = `<div class="wire-grid"><div>${[0, 1, 2].map((i) => `<button data-left="${i}"><span>${symbols[i]}</span> POORT ${i + 1}</button>`).join("")}</div><div class="wire-stream">→<br>→<br>→</div><div>${order.map((i) => `<button data-right="${i}"><span>${symbols[i]}</span> NODE</button>`).join("")}</div></div>`;
    field.querySelectorAll("[data-left]").forEach(
      (b) =>
        (b.onclick = () => {
          field
            .querySelectorAll("[data-left]")
            .forEach((x) => x.classList.remove("selected"));
          selected = Number(b.dataset.left);
          b.classList.add("selected");
          hint("Kies nu hetzelfde symbool rechts.");
        }),
    );
    field.querySelectorAll("[data-right]").forEach(
      (b) =>
        (b.onclick = () => {
          if (selected === null) return;
          if (Number(b.dataset.right) !== selected) {
            hint("Deze symbolen komen niet overeen. Probeer opnieuw.");
            return;
          }
          const l = field.querySelector(`[data-left="${selected}"]`);
          l.disabled = b.disabled = true;
          l.classList.add("connected");
          b.classList.add("connected");
          selected = null;
          click();
          count++;
          hint(`${count} / 3 verbindingen actief`);
          if (count === 3) done(true);
        }),
    );
    hint("Selecteer links een poort.");
  } else {
    const questions = [
      {
        goal: "VUUR",
        hint: "Een droog materiaal heeft warmte nodig.",
        answers: [
          "Hout + wrijving",
          "Water + zand",
          "Metaal + ijs",
          "Hout + water",
        ],
        correct: "Hout + wrijving",
      },
      {
        goal: "ELEKTRISCHE STROOM",
        hint: "Een gesloten geleidend pad tussen twee polen.",
        answers: [
          "Batterij + koperkabel",
          "Hout + glas",
          "IJs + papier",
          "Zand + lucht",
        ],
        correct: "Batterij + koperkabel",
      },
    ];
    const q = questions[Math.floor(Math.random() * questions.length)];
    field.innerHTML = `<div class="reaction-goal"><span>GEVRAAGDE REACTIE</span><strong>${q.goal}</strong><p>${q.hint}</p></div><div class="answer-grid">${shuffle(
      q.answers,
    )
      .map((a) => `<button>${a}</button>`)
      .join("")}</div>`;
    field
      .querySelectorAll("button")
      .forEach((b) => (b.onclick = () => done(b.textContent === q.correct)));
    hint("Kies één combinatie.");
  }
  function toneOnce() {
    click();
  }
  return () => {
    finished = true;
    cleanup();
  };
}
