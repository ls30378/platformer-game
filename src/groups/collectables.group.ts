import Collectable from "../collectables/collectable.entity";

class CollectablesGroup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createFromConfig({
      classType: Collectable,
    });
  }
  addFromLayer(collectables: Phaser.Tilemaps.ObjectLayer) {
    const props = this.mapProperties(collectables.properties);
    collectables.objects.forEach((c) => {
      this.get(c.x, c.y, "diamond");
    });
  }
  mapProperties(propertiesList: any) {
    if (!propertiesList || !propertiesList.length) return;
    return propertiesList.reduce((map: any, obj: any) => {
      map[obj.name] = obj.value;
      return map;
    }, {});
  }
}

export default CollectablesGroup;
