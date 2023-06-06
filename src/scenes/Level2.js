export default class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
  }

  init(estrellas) {
    this.timeLeft = 50;
    this.gameOver = false;
    this.audio;
    this.collectGood;
    this.touchBomm;
    this.jump;
    this.cantEstrellas = estrellas.estrellas;
  }

  create() {
    console.log(this.cantEstrellas);

    /* ------------------------------- SOUNDS ------------------------ */

    this.audio = this.sound.add("sound", { loop: true });
    this.collectGood = this.sound.add("collectGood");
    this.touchBomm = this.sound.add("collectBad");
    this.jump = this.sound.add("jump").setVolume(0.3);
    this.audio.play();
    this.audio.setVolume(0.2);
    this.collectGood.setVolume(0.5);
    this.touchBomm.setVolume(0.5);

    /* ------------------------------- MAP LEVEL 2 ------------------------ */

    const mapN2 = this.make.tilemap({ key: "mapN2" });
    const capaFondoN2 = mapN2.addTilesetImage("sky_atlas", "haven");
    const capaPlataformN2 = mapN2.addTilesetImage("cub_atlas", "platform1");
    const fondoLayerN2 = mapN2.createLayer("fondo2", capaFondoN2, 0, 0);
    const plataformaLayerN2 = mapN2.createLayer(
      "platform2",
      capaPlataformN2,
      0,
      0
    );
    const objectosLayerN2 = mapN2.getObjectLayer("objetos");
    plataformaLayerN2.setCollisionByProperty({ colision: true });
    console.log(objectosLayerN2);
    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint2 = mapN2.findObject(
      "objetos",
      (obj) => obj.name === "jugador"
    );
    console.log(spawnPoint2);
    // The player and its settings
    this.jugador = this.physics.add.sprite(
      spawnPoint2.x,
      spawnPoint2.y,
      "dude"
    );
    //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);
    spawnPoint2 = mapN2.findObject("objetos", (obj) => obj.name === "salida");
    console.log("spawn point salida ", spawnPoint2);
    this.salida = this.physics.add
      .sprite(spawnPoint2.x, spawnPoint2.y, "door")
      .setScale(2);
    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    // Create empty group of starts
    this.estrellas = this.physics.add.group();
    // Create empty group of bombs
    this.bombas = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    // find object layer
    // if type is "stars", add to stars group
    objectosLayerN2.objects.forEach((objData) => {
      // console.log(objData.name, objData.type, objData.x, objData.y);
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.estrellas.create(x, y, "star");
          break;
        }
        case "bomba": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const bomb = this.bombas.create(x, y, "bomb").setBounce(1);
          break;
        }
      }
    });
    this.physics.add.collider(this.jugador, plataformaLayerN2);
    this.physics.add.collider(this.estrellas, plataformaLayerN2);
    this.physics.add.collider(this.bombas, plataformaLayerN2);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      this.collectStars,
      null,
      this
    );
    this.physics.add.collider(
      this.jugador,
      this.bombas,
      this.explosionBomb,
      null,
      this
    );
    this.physics.add.collider(this.salida, plataformaLayerN2);
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

    this.cameras.main.startFollow(this.jugador);
    this.physics.world.setBounds(
      0,
      0,
      mapN2.widthInPixels,
      mapN2.heighInPixels
    );
    this.cameras.main.setBounds(0, 0, mapN2.widthInPixels, mapN2.heighInPixels);
    this.cantidadEstrellasTexto.setScrollFactor(0);
    this.timeText.setScrollFactor(0);

    this.bombas.setVelocity(200, 200);
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

    this.cantEstrellas++;

    this.cantidadEstrellasTexto.setText(
      "Estrellas recolectadas: " + this.cantEstrellas
    );
  }

  explosionBomb(jugador, bomba) {
    bomba.disableBody(true, true);
    this.cantEstrellas = 0;
    this.touchBomm.play();
    this.audio.stop();
    this.scene.restart();
  }

  timer() {
    this.timeLeft--;
    this.timeText.setText("Tiempo restante: " + this.timeLeft);
    if (this.timeLeft <= 0) {
      this.audio.stop();
      this.gameOver = true;
    }
  }

  esVencedor() {
    this.audio.stop();
    this.scene.start("Level3", {
      estrellas: this.cantEstrellas,
    });
  }
}
