import Phaser from "phaser";
import initAnimations from "./anims/playerAnims";
import collidable from "../mixins/collidable";

class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gravity: number;
  playerSpeed: number;
  jumpCount: number;
  consecutiveJumps: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.init();
    this.initEvents();
    Object.assign(this, collidable);
  }
  init() {
    this.jumpCount = 0;
    this.consecutiveJumps = 1;
    this.gravity = 500;
    this.playerSpeed = 200;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.setSize(20, 35);
    this.setGravityY(500);
    this.setCollideWorldBounds(true);
    initAnimations(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    const { left, right, space, up } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }
    if (
      (isSpaceJustDown || isUpJustDown) &&
      (onFloor || this.jumpCount < this.consecutiveJumps)
    ) {
      this.setVelocityY(-this.playerSpeed * 1.5);
      this.jumpCount++;
    }
    if (onFloor) this.jumpCount = 0;
    onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
  }
}
export default Player;
