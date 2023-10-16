import PlayScene from "../scenes/play.scene";

class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  size: { width: number; height: number };
  value: number;
  pixelPerHelath: number;
  config: {
    zoomFactor: number;
    mapOffset: number;
    width: number;
    height: number;
    debug: boolean;
    leftTopCorner: { y: number; x: number };
    rightTopCorner: { y: number; x: number };
  };
  scale: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scale = 1,
    health: number
  ) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.config = (scene as PlayScene).config;
    this.x = (this.config.leftTopCorner.x + 5) / scale;
    this.y = (this.config.leftTopCorner.y + 5) / scale;
    this.scale = scale;
    this.value = health;
    this.size = {
      width: 40,
      height: 8,
    };
    this.pixelPerHelath = this.size.width / this.value;

    scene.add.existing(this.bar);
    this.draw(this.x, this.y, this.scale);
  }
  draw(x: number, y: number, scale: number) {
    this.bar.clear();
    const { width, height } = this.size;
    this.bar.fillStyle(0x000);
    const margin = 2;
    this.bar.fillRect(x, y, width + margin, height + margin);
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);
    const healthWidth = Math.floor(this.value * this.pixelPerHelath);
    if (healthWidth <= this.size.width / 3) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }
    if (healthWidth > 0)
      this.bar.fillRect(
        x + margin,
        y + margin,
        healthWidth - margin,
        height - margin
      );
    this.bar.setScrollFactor(0, 0).setScale(scale);
  }
  decrease(amount: number) {
    this.value = amount > 0 ? amount : 0;
    this.draw(this.x, this.y, this.scale);
  }
}

export default HealthBar;
