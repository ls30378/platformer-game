import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  config;
  constructor(config: { width: number; height: number }) {
    super("PreloadScene");
    this.config = config;
  }

  preload() {
    this.load.tilemapTiledJSON(
      "level-1",
      "assets/crystal_world_map_level_1.json"
    );
    this.load.tilemapTiledJSON(
      "level-2",
      "assets/crystal_world_map_level_2.json"
    );
    this.load.image("tiles-1", "assets/main_lev_build_1.png");
    this.load.image("tiles-2", "assets/main_lev_build_2.png");
    this.load.image("iceball", "assets/weapons/iceball_001.png");
    this.load.image("iceball-1", "assets/weapons/iceball_001.png");
    this.load.image("iceball-2", "assets/weapons/iceball_002.png");
    // this.load.image("player", "assets/player/movements/idle01.png");
    this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32,
    });
    this.load.spritesheet("player-slide", "assets/player/slide_sheet_2.png", {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32,
    });
    this.load.spritesheet("birdman", "assets/enemy/enemy_sheet.png", {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    });
    this.load.spritesheet("snaky", "assets/enemy/enemy_sheet_2.png", {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    });
    this.load.spritesheet(
      "player-throw",
      "assets/player/throw_attack_sheet_1.png",
      {
        frameWidth: 32,
        frameHeight: 38,
        spacing: 32,
      }
    );
    this.load.spritesheet("hit-sheet", "assets/weapons/hit_effect_sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("sword-default", "assets/weapons/sword_sheet_1.png", {
      frameWidth: 52,
      frameHeight: 32,
      spacing: 16,
    });
    this.load.image("fireball-1", "assets/weapons/improved_fireball_001.png");
    this.load.image("fireball-2", "assets/weapons/improved_fireball_002.png");
    this.load.image("fireball-3", "assets/weapons/improved_fireball_003.png");

    this.load.image("diamond", "assets/collectibles/diamond.png");
    this.load.image("diamond-1", "assets/collectibles/diamond_big_01.png");
    this.load.image("diamond-2", "assets/collectibles/diamond_big_02.png");
    this.load.image("diamond-3", "assets/collectibles/diamond_big_03.png");
    this.load.image("diamond-4", "assets/collectibles/diamond_big_04.png");
    this.load.image("diamond-5", "assets/collectibles/diamond_big_05.png");
    this.load.image("diamond-6", "assets/collectibles/diamond_big_06.png");

    this.load.image("bg_spikes_dark", "assets/bg_spikes_dark.png");
    this.load.image("sky-play", "assets/sky_play.png");
    this.load.image("bg-spikes-tileset", "assets/bg_spikes_tileset.png");
    this.load.once("complete", () => this.startGame());
  }
  startGame() {
    this.registry.set("level", 1);
    this.scene.start("PlayScene");
  }
  // create() {
  //   this.scene.start("PlayScene");
  // }
}

export default PreloadScene;
