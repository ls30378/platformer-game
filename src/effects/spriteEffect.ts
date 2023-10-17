class SpriteEffect extends Phaser.Physics.Arcade.Sprite {
  effectName: string;
  target?: Phaser.Physics.Arcade.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, effectName: string) {
    super(scene, x, y, effectName);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.target = null;
    this.effectName = effectName;
  }
  placeEffect() {
    if (!this.target) return;
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
