export default class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level3" });
  }

  init(estrellas) {
    this.timeLeft = 60;
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

    /* ------------------------------- MAP LEVEL 3 ------------------------ */

    const mapN3 = this.make.tilemap({ key: "mapN3" });
    const capaFondoN3 = mapN3.addTilesetImage("sky_atlas", "haven");
    const capaPlataformN3 = mapN3.addTilesetImage("cub_atlas", "platform1");
    const fondoLayerN3 = mapN3.createLayer("fondo3", capaFondoN3, 0, 0);
    const plataformaLayerN3 = mapN3.createLayer(
      "platform3",
      capaPlataformN3,
      0,
      0
    );
    const objectosLayerN3 = mapN3.getObjectLayer("objetos");
    plataformaLayerN3.setCollisionByProperty({ colision: true });
    // console.log(objectosLayerN3);
    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint3 = mapN3.findObject(
      "objetos",
      (obj) => obj.name === "jugador"
    );
    // console.log(spawnPoint3);
    // The player and its settings
    this.jugador = this.physics.add.sprite(
      spawnPoint3.x,
      spawnPoint3.y,
      "dude"
    );
    //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);
    spawnPoint3 = mapN3.findObject("objetos", (obj) => obj.name === "salida");
    // console.log("spawn point salida ", spawnPoint3);
    this.salida = this.physics.add
      .sprite(spawnPoint3.x, spawnPoint3.y, "door")
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
    objectosLayerN3.objects.forEach((objData) => {
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
    this.physics.add.collider(this.jugador, plataformaLayerN3);
    this.physics.add.collider(this.estrellas, plataformaLayerN3);
    this.physics.add.collider(this.bombas, plataformaLayerN3);
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

    this.physics.add.collider(this.salida, plataformaLayerN3);
    this.physics.add.overlap(
      this.jugador,
      this.salida,
      this.esVencedor,
      () => this.cantEstrellas >= 1,
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
      mapN3.widthInPixels,
      mapN3.heighInPixels
    );
    this.cameras.main.setBounds(0, 0, mapN3.widthInPixels, mapN3.heighInPixels);
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
    this.scene.start("Winner");
  }
}
