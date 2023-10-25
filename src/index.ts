import Phaser from "phaser";
import PlayScene from "./scenes/play.scene";
import PreloadScene from "./scenes/preload.scene";
const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;
const MAP_WIDTH = 1600;
const ZOOM_FACTOR = 1.5;
// const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  debug: true,
  leftTopCorner: {
    x: (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
  },
  rightTopCorner: {
    x: (WIDTH / ZOOM_FACTOR + (WIDTH - WIDTH / ZOOM_FACTOR)) / 2,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
  },
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
      debug: SHARED_CONFIG.debug,
      // gravity: { y: 400 },
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
