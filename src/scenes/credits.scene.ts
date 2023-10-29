import BaseScene from "./base.scene";

class CreditsScene extends BaseScene {
  menu: { scene: string; text: string }[];
  constructor(config: any) {
    super("CreditsScene", { ...config, canGoBack: true });
    this.menu = [
      {
        scene: null,
        text: "Thank You For Playing!",
      },
      {
        scene: null,
        text: ":)",
      },
    ];
  }
  create() {
    super.create();
    this.createMenu(this.menu, () => {});
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

export default CreditsScene;
