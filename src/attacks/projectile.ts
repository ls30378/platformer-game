class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  traveledDistance: number;
  maxDistance: number;
  cooldown: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 300;
    this.traveledDistance = 0;
    this.cooldown = 1000;
  }
  fire(x: number, y: number) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }
  isOutOfRange() {
    return this.traveledDistance && this.traveledDistance >= this.maxDistance;
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.traveledDistance += this.body.deltaAbsX();
    if (this.isOutOfRange()) {
      this.setActive(false);
      this.setVisible(false);
      this.body.reset(0, 0);
      this.traveledDistance = 0;
    }
  }
}

export default Projectile;
