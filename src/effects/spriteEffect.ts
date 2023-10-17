class SpriteEffect extends Phaser.Physics.Arcade.Sprite {
  effectName: string;
  target?: Phaser.Physics.Arcade.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, effectName: string) {
    super(scene, x, y, effectName);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.target = null;
    this.effectName = effectName;
    this.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === this.effectName) this.destroy();
      },
      this
    );
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.placeEffect();
  }
  placeEffect() {
    if (!this.target || !this.body) return;
    const center = this.target.getCenter();
    this.body.reset(center.x, center.y);
  }
  playOn(target: Phaser.Physics.Arcade.Sprite) {
    this.target = target;
    this.play(this.effectName, true);
    this.placeEffect();
  }
}
export default SpriteEffect;
