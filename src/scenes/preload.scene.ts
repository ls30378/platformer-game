import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  config;
  constructor(config: { width: number; height: number }) {
    super("PreloadScene");
    this.config = config;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/crystal_world_map.json");
    this.load.image("tiles-1", "assets/main_lev_build_1.png");
    this.load.image("tiles-2", "assets/main_lev_build_2.png");
    this.load.image("iceball", "assets/weapons/iceball_001.png");
    // this.load.image("player", "assets/player/movements/idle01.png");
    this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32,
    });
    this.load.spritesheet("birdman", "assets/enemy/enemy_sheet.png", {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    });
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
