export const HACKS = {
  timing: [
    "Signaal vergrendelen",
    "Stop de indicator in het verlichte venster.",
    "TIMING",
    23,
  ],
  nodes: [
    "Datapulsen volgen",
    "Klik de vijf pulsen in volgorde: 1 → 5.",
    "REACTIE",
    24,
  ],
  memory: [
    "Patroon reconstrueren",
    "Onthoud de reeks en voer hem daarna opnieuw in.",
    "GEHEUGEN",
    30,
  ],
  wires: [
    "Verbinding herstellen",
    "Verbind elke linker aansluiting met hetzelfde symbool rechts.",
    "VERBINDEN",
    30,
  ],
  logic: [
    "Oorzaak & gevolg",
    "Kies de combinatie die de gevraagde reactie veroorzaakt.",
    "LOGICA",
    25,
  ],
  rhythm: [
    "Resonantie vangen",
    "Klik de puls zodra de buitenring de vaste ring raakt. Vang er vijf.",
    "RITME",
    35,
  ],
  maze: [
    "Firewall omzeilen",
    "Klik START en volg de lichte route met de cursor. Pijltjestoetsen werken ook.",
    "PRECISIE",
    45,
  ],
  chess: [
    "Mat in één",
    "Wit is aan zet. Selecteer de witte dame en speel de zet die direct schaakmat geeft.",
    "SCHAAKMAT",
    50,
  ],
  sequence: [
    "Systeemvolgorde",
    "Activeer alle getallen van laag naar hoog.",
    "VOLGORDE",
    30,
  ],
  pipes: [
    "Datastroom omleiden",
    "Draai de bochten zodat één ononderbroken route van IN naar UIT ontstaat.",
    "ROTEREN",
    45,
  ],
  frequency: [
    "Frequentie afstemmen",
    "Zet alle drie frequenties op de gemarkeerde doelwaarde.",
    "AFSTEMMEN",
    35,
  ],
  keypad: [
    "Toegangscode herstellen",
    "Onthoud de code. Voer hem in zodra het display wordt afgeschermd.",
    "CODE",
    30,
  ],
  asteroids: [
    "Dreigingen onderscheppen",
    "Klik de rondzwevende rode dreigingen. Raak geen blauwe satellieten.",
    "RICHTEN",
    35,
  ],
  clean: [
    "Filter reinigen",
    "Sleep het afval naar de opvangbak. Of klik afval en daarna de bak.",
    "SORTEREN",
    35,
  ],
  balance: [
    "Energie in evenwicht",
    "Houd de meter in de veilige zone. Klik links/rechts of gebruik A/D.",
    "BALANS",
    35,
  ],
  locks: [
    "Symboolslot kraken",
    "Draai de drie schijven tot hun symbolen met de voorbeeldcode overeenkomen.",
    "SYMBOLEN",
    35,
  ],
};
export const CHESS_PUZZLES = [
  { king: "f6", queen: "g6", enemy: "h8", mate: "g7" },
  { king: "c6", queen: "b6", enemy: "a8", mate: "b7" },
  { king: "c3", queen: "b3", enemy: "a1", mate: "b2" },
  { king: "f3", queen: "g3", enemy: "h1", mate: "g2" },
];
export const squarePoint = (s) => [s.charCodeAt(0) - 97, 8 - Number(s[1])];
// The curated positions use only kings and a queen. Validate mate, not a trivia answer.
export function isQueenMate(p, target) {
  const q = squarePoint(target),
    king = squarePoint(p.king),
    enemy = squarePoint(p.enemy),
    old = squarePoint(p.queen);
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const kingAttacks = (a, b) =>
    Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) <= 1;
  const attacks = (a, b) =>
    a[0] === b[0] ||
    a[1] === b[1] ||
    Math.abs(a[0] - b[0]) === Math.abs(a[1] - b[1]);
  if (same(q, old) || same(q, king) || same(q, enemy) || !attacks(old, q))
    return false;
  const between = (a, b, c) =>
    attacks(a, c) &&
    attacks(c, b) &&
    Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) ===
      Math.max(Math.abs(a[0] - c[0]), Math.abs(a[1] - c[1])) +
        Math.max(Math.abs(c[0] - b[0]), Math.abs(c[1] - b[1]));
  if (
    between(old, q, king) ||
    between(old, q, enemy) ||
    !attacks(q, enemy) ||
    between(q, enemy, king)
  )
    return false;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue;
      const e = [enemy[0] + dx, enemy[1] + dy];
      if (e.some((n) => n < 0 || n > 7)) continue;
      if (kingAttacks(king, e)) continue;
      if (!same(q, e) && attacks(q, e) && !between(q, e, king)) continue;
      return false;
    }
  return true;
}
