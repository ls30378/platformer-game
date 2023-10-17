class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  traveledDistance: number;
  maxDistance: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 200;
    this.traveledDistance = 0;
  }
  fire() {
    console.log("Firing the projectile");
    this.setVelocityX(this.speed);
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.traveledDistance += this.body.deltaAbsX();
    if (this.traveledDistance >= this.maxDistance) this.destroy();
  }
}

export default Projectile;
