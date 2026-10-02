# Prototype design — Project X

## Core loop

**Explore → meet an NPC or discover a target → activate the Omni-Tool → receive a random hack task → complete it → change the world or damage an enemy → collect loot and story information → upgrade and travel.**

The focus is on making the team's agreed concept tangible. The prototype is a separate Excalibur implementation, not an alternative engine choice for the actual Godot project.

## The narrative

1. **Prologue — before the silence.** A child lives on a peaceful technological world. Their uncle returns with a pirate fleet to steal the family's rare core energy. The parents send the child away on the automatic cargo ship Wayfarer and are captured.
2. **The ship — a forbidden prototype.** Years later, the teenager finds the Omni-Tool while sorting cargo. ARI, the ship's computer, explains that it can rewrite physical laws. The protagonist's inherited energy allows them to survive its normally lethal output. The first random task teaches the hacking interaction.
3. **NEON — the first trail.** Merchant robot Ilo has seen the pirate transports. Helping with the city's relay makes the harbor guardian vulnerable. Its manifest points toward KAGE and confirms that the family was transported alive.
4. **KAGE — the price of balance.** Pirate overseer Vane controls a gravity anchor. Ren wants to preserve the islands by repairing it. Rebel Kaito wants to overload it to break the occupation immediately. The player chooses. Overloading weakens Vane, but damages the landscape; repair preserves it and leaves his armor intact.
5. **CITADEL — blood and code.** Security overrides lead to the uncle's Mech-Tech Armour. The protagonist uses successive random hacking tasks to destroy it. The parents are free, but the years apart and the player's choices have changed the reunion.
6. **Epilogue — bittersweet peace.** The protagonist leaves on the Wayfarer and rests on a tropical planet with a coconut. The ending acknowledges the KAGE decision rather than declaring every player equally ruthless. Afterward, the player can revisit planets and finish the archive quest.

## A universe that can expand

The map intentionally scatters its destinations rather than presenting a straight line. Story progression unlocks coordinates, while visited destinations remain available. Twelve destinations are represented; three have actual playable maps.

| Destination      | Visual theme                                                     | Future mission potential                                           | Status                      |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| NEON             | Rain-lit cyberpunk harbor, industrial neon and information trade | Restore infrastructure, expose stolen cargo and decode hidden logs | Playable chapter 1          |
| KAGE             | Samurai temples, bamboo and floating stone                       | Resolve an occupation without destroying local balance             | Playable chapter 2          |
| CITADEL          | Pirate fortress, red warning lights and mechanical systems       | Release prisoners and face the stolen family technology            | Playable chapter 3 / finale |
| FORGE            | Medieval foundries fused with orbital machinery                  | Help guilds reclaim a forge supplying the pirate army              | Concept                     |
| VIREL            | Bioluminescent jungle and overgrown alien computers              | Stabilize a living network and discover old survey ships           | Concept                     |
| PELAGOS          | Ocean planet, submerged domes and tidal generators               | Reopen flooded routes and retrieve a stranded crew                 | Concept                     |
| CINDER           | Volcanic mines and high-temperature reactors                     | Cool an unstable reactor before an evacuation fails                | Concept                     |
| MIRAGE           | Desert observatories and shifting signal illusions               | Distinguish real coordinates from forged transmissions             | Concept                     |
| HOLLOW           | Abandoned mining moon and buried ruins                           | Uncover the origin of the family's energy research                 | Concept                     |
| MERIDIAN STATION | A single orbital trade station instead of another planet         | Trade, investigate smuggling and meet competing factions           | Concept                     |
| NOX              | Frozen twilight world and radio telescopes                       | Repair a deep-space array to contact missing survivors             | Concept                     |
| RIFT             | Fractured reality and drifting architectural fragments           | Close dangerous distortions produced by failed Omni experiments    | Concept                     |

These concepts are placeholders for future world building, not extra playable levels or a promise of a complete campaign.

## Hack tasks, results and themes

- **Task:** one of five minigames is randomly chosen. Immediate repeats are avoided when another task exists.
- **Result:** battle success deals upgrade-dependent damage; terminals advance missions; archive success opens secrets.
- **Theme:** NEON uses data-network presentation, KAGE uses an anchor/samurai protocol, CITADEL uses imperial encryption. Rules remain consistent.

In the arena, a failed task or expired timer produces a counterattack. The player can retreat between links. Exploration itself pauses in this separate interface, matching the Pokémon-like encounter request. The prototype does not combine WASD movement and a competing WASD hacking sequence.

## Progression and rewards

- Ground pickups provide a small random number of Stars once.
- Chests provide Stars and bolts once.
- Normal encounters provide Stars and hardware once.
- Bosses provide stronger rewards, a chip if an upgrade slot is available, and guaranteed coordinates or story progress.
- Chips increase hack damage from 25 to a maximum of 40.
- Bolts fund two movement upgrades: +15 movement speed and a shorter dash cooldown per upgrade.
- Stars buy chips and recovery; bolts can also be recycled into Stars.
- All three archives complete the optional large quest and give bonus Stars and a chip if there is room.

## Scope and next experiments

The first build deliberately proves the core loop with three compact worlds. It does not implement seamless space-flight, twelve fully built planets, multiplayer, large branching cutscenes, every brainstormed minigame, or a live-service endgame.

Useful next playtest questions:

1. Do players understand that task, effect and theme are separate?
2. Is completing multiple tasks per enemy fun, or does it need faster pacing?
3. Which minigame feels most natural with the Omni-Tool?
4. Does the KAGE choice affect how players interpret the ending?
5. Do Stars, bolts and chips have clearly different uses?
