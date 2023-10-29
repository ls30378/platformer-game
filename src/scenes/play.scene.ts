import Phaser from "phaser";
import Player from "../entities/player.entity";
import Enemies from "../groups/enemies.group";
import Enemy from "../entities/enemy.entity";
import Projectile from "../attacks/projectile";
import initAnims from "../anims/index";
import CollectablesGroup from "../groups/collectables.group";
import Hud from "../hud";
import emitter from "../events/emitter";
import { ConfigType } from "..";

class PlayScene extends Phaser.Scene {
  plotting: Boolean;
  tileHits: Phaser.Tilemaps.Tile[];
  graphics: Phaser.GameObjects.Graphics;
  line: Phaser.Geom.Line;
  playerSpeed: number;
  config: ConfigType;
  score: number;
  hud: Hud;
  skyImage: Phaser.GameObjects.TileSprite;
  spikesImage: Phaser.GameObjects.TileSprite;

  constructor(config: ConfigType) {
    super("PlayScene");
    this.config = config;
  }
  createGameEvents() {
    emitter.on("PLAYER_LOOSE", () => {
      this.scene.restart({ gameStatus: "PLAYER_LOOSE" });
    });
  }
  update() {
    this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1;
  }
  preload() {}
  createBG(map: Phaser.Tilemaps.Tilemap) {
    const bgObject = map.getObjectLayer("distance_bg").objects[0];
    this.spikesImage = this.add
      .tileSprite(
        bgObject.x,
        bgObject.y,
        this.config.width,
        bgObject.height,
        "bg_spikes_dark"
      )
      .setOrigin(0, 1)
      .setDepth(-1)
      .setScrollFactor(0, 1);
    this.skyImage = this.add
      .tileSprite(0, 0, this.config.width, 250, "sky-play")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setScrollFactor(0, 1);
  }
  create({ gameStatus }: { gameStatus: string }) {
    initAnims(this.anims);
    if (gameStatus !== "PLAYER_LOOSE") this.createGameEvents();
    this.hud = new Hud(this, 0, 0).setDepth(100);
    this.score = 0;
    const map = this.createMap();
    this.createBG(map);
    const layer = this.createLayers(map);
    const playerZones = this.getPlayerZones(layer.playerZones);
    const player = this.createPlayer(playerZones);
    const collectables = this.createCollectables(layer.collectables);
    const enemies = this.createEnemies(
      layer.enemySpawns,
      layer.platformColliders
    );
    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layer.platformColliders,
        projectiles: enemies.getProjectiles(),
        collectables,
        traps: layer.traps,
      },
    });
    this.createEnemyColliders(enemies, {
      colliders: {
        platformColliders: layer.platformColliders,
        player,
      },
    });
    this.createBackButton();
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    this.plotting = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.graphics.lineStyle(1, 0x00ff00);
    // this.input.on("pointerdown", this.startDrawing, this);
    // this.input.on(
    //   "pointerup",
    //   (pointer: Phaser.Input.Pointer) =>
    //     this.finishDrawing(pointer, layer.platform),
    //   this
    // );
  }
  createBackButton() {
    const btn = this.add
      .image(
        this.config.rightBottomCorner.x,
        this.config.rightBottomCorner.y,
        "back"
      )
      .setScrollFactor(0)
      .setScale(2)
      .setOrigin(1)
      .setInteractive();
    btn.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }
  createCollectables(collectables: Phaser.Tilemaps.ObjectLayer) {
    const collectableLayers = new CollectablesGroup(this).setDepth(-1);
    collectableLayers.addFromLayer(collectables);
    collectableLayers.playAnimation("diamond-shine");
    return collectableLayers;
  }
  drawDebug(layer: Phaser.Tilemaps.DynamicTilemapLayer) {
    const collidingTileColor = new Phaser.Display.Color(243, 134, 48, 100);
    layer.renderDebug(this.graphics, {
      tileColor: null,
      collidingTileColor,
    });
  }
  startDrawing(pointer: Phaser.Input.Pointer) {
    if (this.tileHits?.length) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(false);
        }
      });
    }

    this.line.x1 = pointer.worldX;
    this.line.y1 = pointer.worldY;
    this.plotting = true;
  }

  finishDrawing(
    pointer: Phaser.Input.Pointer,
    layer: Phaser.Tilemaps.DynamicTilemapLayer
  ) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;
    this.graphics.strokeLineShape(this.line);
    this.tileHits = layer.getTilesWithinShape(this.line);
    if (this.tileHits.length) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(true);
        }
      });
    }
    this.drawDebug(layer);
    this.plotting = false;
  }

  createEndOfLevel(end: Phaser.Types.Tilemaps.TiledObject, player: Player) {
    const endZone = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0)
      .setSize(5, 200)
      .setOrigin(0, 1);
    const eolOverlap = this.physics.add.overlap(endZone, player, () => {
      eolOverlap.active = false;
      if (this.registry.get("level") === this.config.lastLevel) {
        this.scene.start("CreditsScene");
        return;
      }
      this.registry.inc("level", 1);
      this.registry.inc("unlocked-levels", 1);
      this.scene.restart({ gameStatus: "LEVEL_COMPLETED" });
    });
  }
  getPlayerZones(playerZones: Phaser.Types.Tilemaps.TiledObject[]) {
    return {
      start: playerZones.filter((z) => z.name === "startZone")[0],
      end: playerZones.filter((z) => z.name === "endZone")[0],
    };
  }
  getCurrentLevel() {
    return this.registry.get("level") || 1;
  }
  setupFollowupCameraOn(player: Player) {
    const { height, mapOffset, width, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }
  onCollect(entity: any, collectable: any) {
    this.score += collectable.score;
    this.hud.updateScoreboard(this.score);
    collectable.disableBody(true, true);
  }
  createPlayerColliders(
    player: Player,
    {
      colliders,
    }: {
      colliders: any;
    }
  ) {
    player.addCollider(colliders.platformColliders);
    player.addCollider(colliders.traps, this.onWeaponHit);
    player.addOverlap(colliders.collectables, this.onCollect, this);
  }
  createMap() {
    const map = this.make.tilemap({
      key: `level-${this.getCurrentLevel()}`,
    });
    map.addTilesetImage("main_lev_build_1", "tiles-1");
    map.addTilesetImage("main_lev_build_2", "tiles-2");
    map.addTilesetImage("bg_spikes_tileset", "bg-spikes-tileset");
    return map;
  }
  createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset1 = map.getTileset("main_lev_build_1");
    const bg = map.getTileset("bg_spikes_tileset");
    map.createStaticLayer("distance", bg).setDepth(-2);
    const platformColliders = map.createDynamicLayer(
      "platform-colliders",
      tileset1
    );
    const env = map.createStaticLayer("env", tileset1).setDepth(-2);
    const traps = map.createStaticLayer("traps", tileset1);
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    const platform = map.createDynamicLayer("platforms", tileset1);
    const playerZones = map.getObjectLayer("player_zones").objects;
    const collectables = map.getObjectLayer("collectables");
    platformColliders.setCollisionByExclusion([-1], true);
    traps.setCollisionByExclusion([-1], true);
    return {
      env,
      platform,
      platformColliders,
      playerZones,
      enemySpawns,
      collectables,
      traps,
    };
  }
  createPlayer(playerZones: {
    start: Phaser.Types.Tilemaps.TiledObject;
    end: Phaser.Types.Tilemaps.TiledObject;
  }) {
    const player: Player = new Player(
      this,
      playerZones.start.x,
      playerZones.start.y
    );
    return player;
  }

  createEnemies(
    spawns: Phaser.Tilemaps.ObjectLayer,
    platformColliders: Phaser.Tilemaps.DynamicTilemapLayer
  ) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();
    spawns.objects.forEach((spawnPoint) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemy.setPlatformColliders(platformColliders);
      enemies.add(enemy);
    });
    return enemies;
  }

  onWeaponHit(entity: Enemy, source: Projectile) {
    entity.takesHit(source);
  }
  createEnemyColliders(
    enemies: Enemies,
    {
      colliders,
    }: {
      colliders: any;
    }
  ) {
    enemies.addCollider(colliders.platformColliders);
    enemies.addCollider(colliders.player, this.onPlayerCollision);
    enemies.addCollider(colliders.player.projectiles, this.onWeaponHit);
    enemies.addCollider(colliders.player.meleeWeapon, this.onWeaponHit);
  }
  onPlayerCollision(enemy: Enemy, player: Player) {
    player.takesHit(enemy);
  }
}

export default PlayScene;
