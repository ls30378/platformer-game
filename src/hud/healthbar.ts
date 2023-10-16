class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  size: { width: number; height: number };
  value: number;
  pixelPerHelath: number;
  constructor(scene: Phaser.Scene, x: number, y: number, health: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.value = health;
    this.size = {
      width: 40,
      height: 8,
    };
    this.pixelPerHelath = this.size.width / this.value;

    scene.add.existing(this.bar);
  }
}

export default HealthBar;
