class Collectable extends Phaser.Physics.Arcade.Sprite {
  score: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);

    this.score = 1;
    scene.tweens.add({
      targets: this,
      y: this.y - 20,
      duration: Phaser.Math.Between(1500, 2500),
      repeat: -1,
      ease: "linear",
      yoyo: true,
    });
  }
}

export default Collectable;
