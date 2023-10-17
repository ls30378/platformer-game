import SpriteEffect from "./spriteEffect";

class EffectManager {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  playEffectOn(
    effectName: string,
    target: Phaser.Physics.Arcade.Sprite,
    impactPosition: {
      x: number;
      y: number;
    }
  ) {
    const effect = new SpriteEffect(
      this.scene,
      0,
      0,
      effectName,
      impactPosition
    );
    effect.playOn(target);
  }
}

export default EffectManager;
