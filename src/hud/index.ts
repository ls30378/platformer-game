import PlayScene from "../scenes/play.scene";

class Hud extends Phaser.GameObjects.Container {
  fontSize: number;
  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y);

    scene.add.existing(this);

    const { rightTopCorner } = scene.config;
    this.setPosition(rightTopCorner.x - 50, rightTopCorner.y);
    this.setScrollFactor(0);
    this.fontSize = 20;
    this.setupList();
  }
  setupList() {
    const scoreBoard = this.createScoreboard();
    this.add(scoreBoard);
  }
  createScoreboard() {
    const scoreText = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });
    const scoreImage = this.scene.add
      .image(scoreText.width + 5, 5, "diamond")
      .setOrigin(0);
    const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
    scoreBoard.setName("scoreBoard");
    return scoreBoard;
  }
  updateScoreboard(score: number | string) {
    const [scoreText, scoreImage] = (this.getByName("scoreBoard") as any).list;
    scoreText.setText(score);
    scoreImage.setX(scoreText.width + 5);
  }
}

export default Hud;
