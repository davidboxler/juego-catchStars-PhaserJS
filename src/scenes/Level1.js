export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  init() {
    this.timeLeft = 2;
    this.gameOver = false;
    this.audio;
    this.collectGood;
    this.touchBomm;
    this.jump;
    this.cantidadEstrellas = 0;
  }

  create() {
    /* ------------------------------- SOUNDS ------------------------ */

    this.audio = this.sound.add("sound", { loop: true });
    this.collectGood = this.sound.add("collectGood");
    this.touchBomm = this.sound.add("collectBad");
    this.jump = this.sound.add("jump").setVolume(0.3);
    this.audio.play();
    this.audio.setVolume(0.2);
    this.collectGood.setVolume(0.5);
    this.touchBomm.setVolume(0.5);

    /* ------------------------------- MAP LEVEL 1 ------------------------ */

    const mapN1 = this.make.tilemap({ key: "mapN1" });
    const capaFondoN1 = mapN1.addTilesetImage("sky_atlas", "haven");
    const capaPlataformN1 = mapN1.addTilesetImage("cub_atlas", "platform1");
    const fondoLayerN1 = mapN1.createLayer("fondo", capaFondoN1, 0, 0);
    const plataformaLayerN1 = mapN1.createLayer(
      "platform",
      capaPlataformN1,
      0,
      0
    );
    const objectosLayerN1 = mapN1.getObjectLayer("objetos");
    plataformaLayerN1.setCollisionByProperty({ colision: true });
    console.log(objectosLayerN1);
    // // crear el jugador
    // // Find in the Object Layer, the name "dude" and get position
    let spawnPoint = mapN1.findObject(
      "objetos",
      (obj) => obj.name === "jugador"
    );
    console.log(spawnPoint);
    // // The player and its settings
    this.jugador = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");
    // //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);
    spawnPoint = mapN1.findObject("objetos", (obj) => obj.name === "salida");
    console.log("spawn point salida ", spawnPoint);
    this.salida = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "door")
      .setScale(2);
    // //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    // // Create empty group of starts
    this.estrellas = this.physics.add.group();
    // // find object layer
    // // if type is "stars", add to stars group
    objectosLayerN1.objects.forEach((objData) => {
      // console.log(objData.name, objData.type, objData.x, objData.y);
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.estrellas.create(x, y, "star");
          break;
        }
      }
    });
    this.physics.add.collider(this.jugador, plataformaLayerN1);
    this.physics.add.collider(this.estrellas, plataformaLayerN1);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      this.collectStars,
      null,
      this
    );
    this.physics.add.collider(this.salida, plataformaLayerN1);
    this.physics.add.overlap(
      this.jugador,
      this.salida,
      this.esVencedor,
      () => this.cantidadEstrellas >= 1, 
      this
    );

    /* ------------------------------- EVENTS ------------------------ */

    this.cantidadEstrellasTexto = this.add.text(
      15,
      15,
      "Estrellas recolectadas: 0",
      {
        fontSize: "15px",
        fill: "#000",
        fontStyle: "bold",
        backgroundColor: "yellow",
      }
    );

    this.timeText = this.add.text(
      700,
      15,
      "Tiempo restante: " + this.timeLeft,
      {
        fontSize: "15px",
        fill: "#000",
        fontStyle: "bold",
        backgroundColor: "yellow",
      }
    );

    this.time.addEvent({
      delay: 1000,
      callback: this.timer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.gameOver) {
      this.scene.start("GameOver");
      this.timeLeft = 40;
    }

    //move left
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-160);
      this.jugador.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(160);
      this.jugador.anims.play("right", true);
    }
    //stop
    else {
      this.jugador.setVelocityX(0);
      this.jugador.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.jugador.body.blocked.down) {
      this.jugador.setVelocityY(-330);
      this.jump.play();
    }
  }

  collectStars(jugador, estrella) {
    estrella.disableBody(true, true);
    this.collectGood.play();
    this.cantidadEstrellas++;
    this.cantidadEstrellasTexto.setText(
      "Estrellas recolectadas: " + this.cantidadEstrellas
    );
  }

  explosionBomb(jugador, bomba) {
    bomba.disableBody(true, true);
    this.touchBomm.play();
    this.audio.stop();
    this.scene.restart();
  }

  timer() {
    this.timeLeft--;
    this.timeText.setText("Tiempo restante: " + this.timeLeft);
    if (this.timeLeft <= 0) {
      this.gameOver = true;
    }
  }

  esVencedor() {
    this.audio.stop();
    this.scene.start("Level2", {
      estrellas: this.cantidadEstrellas,
    });
  }
}
