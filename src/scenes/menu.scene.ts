import BaseScene from "./base.scene";

class MenuScene extends BaseScene {
  menu: { scene: string; text: string }[];
  constructor(config: any) {
    super("MenuScene", config);
    this.menu = [
      {
        scene: "PlayScene",
        text: "Play",
      },
      {
        scene: "LevelScene",
        text: "Levels",
      },
      {
        scene: null,
        text: "Exit",
      },
    ];
  }
  create() {
    super.create();
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
      menuItem.scene && this.scene.start(menuItem.scene);
      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
