export default class Preloaded extends Phaser.Scene {
  // escena para optimiozar tiempos
  // carga el preload solo una vez y sirve para todo el juego
  constructor() {
    // key of the scene
    super("preloaded");
  }

  preload() {
    // load assets
    this.load.tilemapTiledJSON("mapN1", "../../public/tilemaps/level1.json");
    this.load.tilemapTiledJSON("mapN2", "../../public/tilemaps/level2.json");
    this.load.tilemapTiledJSON("mapN3", "../../public/tilemaps/level3.json");
    this.load.image("haven", "../../public/images/sky_atlas.png");
    this.load.image("platform1", "../../public/images/cub_atlas.png");
    this.load.image("star", "../../public/images/star.png");
    this.load.spritesheet("dude", "../../public/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("bomb", "../../public/images/bomb.png");
    this.load.image("door", "../../public/images/door.png");
    this.load.image("game-over", "../../public/images/game-over.png");
    this.load.image("congrats", "../../public/images/congrats.png");

    this.load.audio("collectBad", "../../public/sounds/bad.mp3");
    this.load.audio("sound", "../../public/sounds/goats.mp3");
    this.load.audio("collectGood", "../../public/sounds/good.wav");
    this.load.audio("jump", "../../public/sounds/salto.wav");
    this.load.audio("won", "../../public/sounds/wonderful.mp3");
  }

  create() {
    //  Our player animations, turning, walking left and walking right.
    // se crea una sola vez, para que no de error en el restart de la escena

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // init scene juego
    this.scene.start("Level1");
  }
}
