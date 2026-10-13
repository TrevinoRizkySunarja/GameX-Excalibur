// Each beat is a readable subtitle, with a specific speaker and response.
// The final button performs the quest action, so advancing dialogue cannot
// accidentally accept a mission or pay its reward early.
import { imageForCharacter } from "./story.js";
const frame = (speaker, portrait, text, title, image, listener = "hero") => ({speaker, portrait, text, title, image, listener: portrait === "hero" ? listener : "hero"});
const voices = {
  nyx: ["Die stem… is dat iemand die je kent?", "Mijn zus. Het Koor heeft haar laatste oproep gestolen. Ze mag meer zijn dan een wachtwoord.", "Ik wil mijn ouders terugvinden. Maar niet door de herinneringen van iemand anders te wissen."],
  cass: ["Waarom blijf je hier als de piraten de stroom afsluiten?", "Omdat zieke mensen niet ineens beter kunnen lopen als er oorlog uitbreekt. Hier blijven is ook een keuze.", "Mijn moeder kon nooit iemand laten wachten. Misschien leer ik nog wat dat haar kostte."],
  flux: ["Je kende mijn ouders? Vertel me hoe ze waren, voordat alles begon.", "Je vader vergat altijd zijn eigen gereedschap. Je moeder vergat nooit een naam. Ze repareerden mijn schip en vroegen waar ik heen wilde.", "Ik herinner me vooral hun laatste woorden. Het helpt om ook de gewone dagen te horen."],
  akari: ["Waarom smeed je geen zwaard tegen Vane?", "Dat heb ik al gedaan. Hij kocht het van iemand anders. Deze keer wil ik iets maken dat niet hoeft te winnen om nuttig te zijn.", "De Omni-Tool kan deuren openen en pantser breken. Ik wil niet vergeten dat het ook iets kan herstellen."],
  sumi: ["Hoe weet je welke namen de piraten hebben gewist?", "Omdat ik ze iedere avond hardop herhaal. Mijn ogen konden hun bevelen niet lezen. Mijn geheugen heeft ze nooit gehoorzaamd.", "Als ik mijn ouders vind, wil ik dat ze weten hoeveel mensen hun namen bewaarden."],
  kaede: ["Je vocht voor Vane. Waarom zou ik je vertrouwen?", "Je hoeft mij niet te vertrouwen. Controleer de stenen, de routes, de namen. Mijn spijt mag geen bewijs vervangen.", "Ik kan je verleden niet voor je oplossen. Maar ik kan je helpen om nu een andere keuze te maken."],
};
export function npcFrames(obj, q, ready, state, id) {
  const image = voices[id] ? `district-${q?.world || state.world}` : imageForCharacter(id);
  const title = q?.name || obj.name;
  if (ready) return [
    frame(obj.name, id, q.ending, title, image),
    frame("Jij", "hero", "Wat hier gebeurde, neem ik mee. De tool verandert de wereld, maar jullie veranderen waarom ik hem gebruik.", title, image, id),
    frame(obj.name, id, `Neem dit mee: ${q.reward} Stars, hardware en ${q.chip ? "mijn Omni-Tool-software" : "onderdelen voor de volgende reis"}. Kom terug als je klaar bent; er is altijd meer dan één deur die hulp nodig heeft.`, title, image),
  ];
  if (!q) return [frame(obj.name, id, obj.line + (state.flags.campaignDone ? " De kapitein is weg. Het herstellen kost langer dan het gevecht, maar nu kiezen we zelf hoe." : " Reis voorzichtig. De straten houden meer verhalen vast dan de scanner laat zien."), title, image)];
  const v=voices[id];
  const frames=[frame(obj.name, id, obj.line, title, image)];
  if (v && !state.flags[`accepted_${q.id}`]) {
    frames.push(frame("Jij", "hero", v[0], title, image, id), frame(obj.name, id, v[1], title, image));
  }
  frames.push(frame(obj.name, id, q.story, title, image));
  if(v && !state.flags[`accepted_${q.id}`])frames.push(frame("Jij", "hero", v[2], title, image, id));
  frames.push(frame(obj.name, id, q.goals.map(g => g.label).join(". ") + ". Meld je daarna bij mij. Je kunt de opdracht volgen in het logboek; de scanner wijst de route.", title, image));
  return frames;
}
export const MAIN_CONVERSATIONS = {
  ilo: [
    frame("Ilo", "ilo", "Dat schip herken ik. De Wayfarer kwam hier vroeger voor medicijnen, niet voor wapens. Wie heeft je de landing gegeven?", "Het eerste spoor", "chapter-1"),
    frame("Jij", "hero", "Mijn ouders. De piraten namen hen mee. Ik heb alleen hun schip en een tool die ik nauwelijks begrijp.", "Het eerste spoor", "chapter-1", "ilo"),
    frame("Ilo", "ilo", "Ik heb het transportmanifest gezien. Twee levende gevangenen, familiecode afgeschermd. K-9 houdt het origineel in de vrachthaven.", "Het eerste spoor", "chapter-1"),
    frame("Jij", "hero", "Dus ze leven. Wat moet ik doen om bij dat manifest te komen?", "Het eerste spoor", "chapter-1", "ilo"),
    frame("Ilo", "ilo", "Herschrijf het energierelais op het Signaalplein. Dan valt zijn externe schild weg. Help onderweg Mira, Nyx of Cass: een sterke tool begint bij de mensen die je helpt.", "Het eerste spoor", "chapter-1"),
  ],
  ren: [
    frame("Meester Ren", "ren", "Je voeten staan op steen, maar KAGE drijft op vertrouwen. Het anker houdt onze eilanden samen. Vane gebruikt hetzelfde systeem om ons gevangen te zetten.", "De prijs van evenwicht", "chapter-2"),
    frame("Jij", "hero", "Kaito zegt dat ik het hele netwerk moet breken. Als dat Vane stopt, waarom twijfelt u?", "De prijs van evenwicht", "chapter-2", "ren"),
    frame("Meester Ren", "ren", "Mijn kleindochter woont op de laagste rots. Iedere steen die valt, heeft een naam. Vrijheid telt ook voor wie het gevecht niet kan overleven.", "De prijs van evenwicht", "chapter-2"),
    frame("Jij", "hero", "Mijn ouders stuurden me weg om me te beschermen. Ik wil niet iemand anders laten kiezen wie er achterblijft.", "De prijs van evenwicht", "chapter-2", "ren"),
    frame("Meester Ren", "ren", "Onderzoek het anker. Hoor Kaito aan. De keuze moet de jouwe zijn. Sumi bewaart de oude signalen; Akari weet wat je tool kan dragen.", "De prijs van evenwicht", "chapter-2"),
  ],
  kaito: [
    frame("Kaito", "kaito", "Mijn broer wachtte op toestemming om te vertrekken. Vane schoot zijn veerboot neer. Ik wacht niet nog een keer tot iemand ons veilig noemt.", "Het gewicht van vandaag", "chapter-3"),
    frame("Jij", "hero", "En de mensen op de eilanden als het anker breekt?", "Het gewicht van vandaag", "chapter-3", "kaito"),
    frame("Kaito", "kaito", "Die vraag stel ik mezelf iedere nacht. Ren denkt dat herstellen genoeg is. Ik wil de piraten hun macht afnemen, ook als ik daarna voor die keuze moet leven.", "Het gewicht van vandaag", "chapter-3"),
    frame("Jij", "hero", "Ik kom terug naar het anker. Maar ik ga eerst kijken wie er beneden woont.", "Het gewicht van vandaag", "chapter-3", "kaito"),
  ],
};
export function dungeonIntro(d) {
  return [
    frame("ARI", "ari", `Je betreedt ${d.name}. Er zijn drie beveiligingslagen: een wachtergroep, twee zegels en een bosskern. De scanner volgt je volgende doel. Je kunt altijd via de drempel terug.`, d.subtitle, `dungeon-${d.theme}`),
    frame(d.character[0].toUpperCase()+d.character.slice(1), d.character, d.theme === "neon" ? "De piraten bouwden deze zaal om herinneringen vast te houden. Breek de bewakers, maar laat de stemmen heel. In de kluis ligt software die nergens te koop is." : "Onder deze stenen werd kracht ooit doorgegeven, niet gestolen. Herschrijf de twee zegels en bevrijd wat in de kern wacht. Het staal zal weten wat je hier deed.", d.subtitle, `dungeon-${d.theme}`),
    frame("Jij", "hero", "Dan begin ik bij de mensen die dit gebouwd hebben. Eén zegel tegelijk.", d.subtitle, `dungeon-${d.theme}`, d.character),
  ];
}
export function extraBossIntro(obj, theme) {
  const lines={
    chorus:"Duizend gestolen stemmen eisen dezelfde stilte. Midden in het koor hoor je een mens om hulp vragen.",
    matriarch:"PRISMA toont je een perfecte herinnering aan je ouders. Hun gezichten glimlachen precies op hetzelfde moment. Te precies.",
    warden:"De Stormwachter draagt de bakens van neergeschoten schepen in zijn pantser. De Wayfarer verschijnt als zijn volgende doelwit.",
    bellkeeper:"Hyaku heft vier armen. Iedere bel luidt een ander bevel. Onder het metaal probeert de oude tempel nog steeds te antwoorden.",
    moth:"De maanmot ontplooit haar keramische vleugels. In de kern brandt het onvoltooide ontwerp van je vader.",
    fox:"Negen maskers spreken Kaede’s oude eed uit. De tiende stem is die van hemzelf: ‘Deze keer blijf ik voor de bewoners.’",
  };
  return [frame("ARI", "ari", lines[obj.form] || "De bosskern ontwaakt.", obj.name, `dungeon-${theme}`), frame("Jij", "hero", "Ik weet wat je bewaart. Ik laat het hier niet opgesloten.", obj.name, `dungeon-${theme}`, "ari")];
}
