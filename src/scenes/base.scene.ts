import Phaser from "phaser";
class BaseScene extends Phaser.Scene {
  config: { width: number; height: number; canGoBack: boolean };
  screenCenter: number[];
  constructor(
    key: string,
    config: { width: number; height: number; canGoBack: boolean }
  ) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
  }

  create() {
    this.createBG();
    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 10, this.config.height - 10, "back")
        .setOrigin(1)
        .setScale(2)
        .setInteractive();
      backButton.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }
  createBG() {
    this.add.image(0, 0, "menu-bg").setOrigin(0, 0).setScale(3);
  }
  createMenu(menu: any, setupMenuEvents: any) {
    let gap = 0;
    menu.forEach((menuItem: any) => {
      menuItem.textGO = this.add
        .text(this.screenCenter[0], this.screenCenter[1] + gap, menuItem.text, {
          fontSize: "32px",
          fill: "#fff",
        })
        .setOrigin(0.5, 1);
      setupMenuEvents(menuItem);
      gap += 40;
    });
  }
}

export default BaseScene;
