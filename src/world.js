import * as ex from "excalibur";
import { WORLDS, WORLD_WIDTH, WORLD_HEIGHT, targetFor } from "./data.js";
import { floorGraphic, entityGraphic, playerGraphic } from "./art.js";

export class Explorer extends ex.Actor {
  constructor(pos, controller) {
    super({
      pos: ex.vec(...pos),
      width: 18,
      height: 16,
      collisionType: ex.CollisionType.Active,
    });
    this.controller = controller;
    this.facing = "down";
    this.destination = null;
    this.dashUntil = 0;
    this.dashReady = 0;
    this.graphics.use(playerGraphic(this));
    this.graphics.anchor = ex.vec(0.5, 0.83);
  }
  onPreUpdate(engine) {
    if (this.controller.paused) {
      this.vel = ex.Vector.Zero;
      return;
    }
    const keyboard = engine.input.keyboard;
    let x =
      (keyboard.isHeld(ex.Keys.D) || keyboard.isHeld(ex.Keys.Right) ? 1 : 0) -
      (keyboard.isHeld(ex.Keys.A) || keyboard.isHeld(ex.Keys.Left) ? 1 : 0);
    let y =
      (keyboard.isHeld(ex.Keys.S) || keyboard.isHeld(ex.Keys.Down) ? 1 : 0) -
      (keyboard.isHeld(ex.Keys.W) || keyboard.isHeld(ex.Keys.Up) ? 1 : 0);
    if (x || y) this.destination = null;
    if (!x && !y && this.destination) {
      const diff = this.destination.sub(this.pos);
      if (diff.magnitude < 8) this.destination = null;
      else {
        x = diff.x;
        y = diff.y;
      }
    }
    const now = performance.now();
    const hardware = Math.min(
      2,
      this.controller.state.flags.hardwareUpgrade || 0,
    );
    if (
      keyboard.wasPressed(ex.Keys.Space) &&
      now > this.dashReady &&
      (x || y)
    ) {
      this.dashUntil = now + 160;
      this.dashReady = now + 1000 - hardware * 100;
    }
    this.vel =
      x || y
        ? ex
            .vec(x, y)
            .normalize()
            .scale(now < this.dashUntil ? 460 : 170 + hardware * 15)
        : ex.Vector.Zero;
    if (Math.abs(y) > Math.abs(x)) this.facing = y < 0 ? "up" : "down";
    else if (x) this.facing = x < 0 ? "left" : "right";
    this.pos.x = Math.max(80, Math.min(WORLD_WIDTH - 80, this.pos.x));
    this.pos.y = Math.max(80, Math.min(WORLD_HEIGHT - 80, this.pos.y));
  }
}

export class PlanetScene extends ex.Scene {
  constructor(id, controller) {
    super();
    this.id = id;
    this.planet = WORLDS[id];
    this.controller = controller;
    this.worldActors = new Map();
    this.nearest = null;
  }
  onInitialize(engine) {
    const floor = new ex.Actor({
      pos: ex.vec(0, 0),
      anchor: ex.vec(0, 0),
      z: -100,
    });
    floor.graphics.use(floorGraphic(this.planet));
    floor.graphics.anchor = ex.vec(0, 0);
    this.add(floor);
    this.planet.obstacles.forEach(([x, y, w, h]) =>
      this.add(
        new ex.Actor({
          pos: ex.vec(x + w / 2, y + h / 2 + 15),
          width: w,
          height: h - 15,
          collisionType: ex.CollisionType.Fixed,
        }),
      ),
    );
    this.player = new Explorer(this.planet.spawn, this.controller);
    this.add(this.player);
    this.planet.objects.forEach((obj) => {
      const actor = new ex.Actor({
        pos: ex.vec(obj.x, obj.y),
        width: 32,
        height: 32,
        z: 1,
      });
      actor.data = { obj };
      actor.graphics.use(
        entityGraphic(obj, this.planet, () => this.nearest?.id === obj.id),
      );
      actor.graphics.anchor = ex.vec(0.5, 0.59);
      this.add(actor);
      this.worldActors.set(obj.id, actor);
    });
    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(
      new ex.BoundingBox({ left: 55, top: 55, right: 1385, bottom: 985 }),
    );
    this.refresh();
  }
  onActivate() {
    if (this.player) {
      this.player.destination = null;
      this.player.vel = ex.Vector.Zero;
    }
    this.refresh();
  }
  refresh() {
    const state = this.controller.state;
    for (const [id, a] of this.worldActors) {
      const hidden =
        state.collected.includes(id) || state.defeated.includes(id);
      a.graphics.visible = !hidden;
    }
  }
  onPostUpdate(engine) {
    if (!this.player) return;
    this.player.z = Math.floor(this.player.pos.y / 10);
    for (const a of this.worldActors.values()) a.z = Math.floor(a.pos.y / 10);
    if (this.controller.paused) {
      this.controller.setPrompt(null);
      return;
    }
    let nearest = null,
      dist = 85;
    for (const obj of this.planet.objects) {
      if (
        this.controller.state.collected.includes(obj.id) ||
        this.controller.state.defeated.includes(obj.id)
      )
        continue;
      const d = this.player.pos.distance(ex.vec(obj.x, obj.y));
      if (
        obj.type === "enemy" &&
        d < 28 &&
        this.player.vel.magnitude > 5 &&
        performance.now() > (this.controller.encounterUntil || 0)
      ) {
        this.controller.interact(obj);
        return;
      }
      if (obj.type === "loot" && d < 32) {
        this.controller.interact(obj);
        continue;
      }
      if (d < dist && obj.type !== "loot") {
        nearest = obj;
        dist = d;
      }
    }
    this.nearest = nearest;
    this.controller.setPrompt(nearest);
    if (engine.input.keyboard.wasPressed(ex.Keys.E) && nearest)
      this.controller.interact(nearest);
    const target = this.planet.objects.find(
      (o) => o.id === targetFor(this.controller.state, this.id),
    );
    this.controller.updateRadar(this.player.pos, target);
  }
  pointer(pos) {
    if (this.controller.paused) return;
    const target = this.planet.objects.find(
      (o) =>
        Math.hypot(o.x - pos.x, o.y - pos.y) < 40 &&
        !this.controller.state.collected.includes(o.id) &&
        !this.controller.state.defeated.includes(o.id),
    );
    if (target && this.player.pos.distance(ex.vec(target.x, target.y)) < 110)
      this.controller.interact(target);
    else this.player.destination = pos;
  }
}

export async function createEngine(controller) {
  const game = new ex.Engine({
    canvasElementId: "world-canvas",
    width: 960,
    height: 600,
    displayMode: ex.DisplayMode.FitContainerAndFill,
    backgroundColor: ex.Color.fromHex("#0a131b"),
    antialiasing: false,
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    pointerScope: ex.PointerScope.Canvas,
    maxFps: 60,
  });
  controller.engine = game;
  for (const id of Object.keys(WORLDS))
    game.add(id, new PlanetScene(id, controller));
  game.input.pointers.primary.on("down", (evt) =>
    game.currentScene.pointer?.(evt.worldPos),
  );
  await game.start();
  await game.goToScene(
    controller.state.world in WORLDS ? controller.state.world : "neon",
  );
  return game;
}
