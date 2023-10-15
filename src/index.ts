import Phaser from "phaser";
import PlayScene from "./scenes/play.scene";
import PreloadScene from "./scenes/preload.scene";
const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;
const MAP_WIDTH = 1600;
// const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: 1.5,
};
const Scenes = [PreloadScene, PlayScene];
const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));
const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: { y: 400 },
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
