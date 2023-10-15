import Phaser from "phaser";
import collidable from "../mixins/collidable";
import Enemy from "./enemy.entity";
import initAnims from "./anims/birdAnims";

class Birdman extends Enemy {
  gravity: number;
  speed: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "birdman");
    initAnims(this.scene.anims);
  }
  update(time: number, delta: number) {
    super.update(time, delta);
    this.play("birdman-idle", true);
  }
}
export default Birdman;
