import BaseScene from "./base.scene";

class LevelScene extends BaseScene {
  menu: { scene: string; text: string; level: number }[];
  constructor(config: any) {
    super("LevelScene", { ...config, canGoBack: true });
  }
  create() {
    super.create();
    const levels = this.registry.get("unlocked-levels");
    this.menu = [];
    for (let i = 1; i <= levels; i++) {
      this.menu.push({
        scene: "PlayScene",
        text: `Level ${i}`,
        level: i,
      });
    }
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }
  setupMenuEvents(menuItem: any) {
    const { textGO } = menuItem;
    textGO.setInteractive();
    textGO.on("pointerover", () => {
      textGO.setStyle({
        fill: "#ff0",
      });
    });
    textGO.on("pointerout", () => {
      textGO.setStyle({
        fill: "#fff",
      });
    });
    textGO.on("pointerup", () => {
      if (menuItem.scene) {
        this.registry.set("level", menuItem.level);
        this.scene.start(menuItem.scene);
      }
      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default LevelScene;
