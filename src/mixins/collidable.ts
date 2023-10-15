export default {
  addCollider(otherGameObject: any, callback?: Function) {
    this.scene.physics.add.collider(
      this,
      otherGameObject,
      callback,
      null,
      this
    );
  },
};
