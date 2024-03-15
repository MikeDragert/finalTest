import "./App.css";
import { useEffect, useState } from "react";
import workBench from "./components/WorkBench.js";
import Phaser from "phaser";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

function App() {
  let game;
  let playerSpeed = 20;

  const [state, setState] = useState({ counter: 0, loaded: false });

  function preload() {
    this.load.setBaseURL("http://localhost:3000");
    this.load.image("sky", "assets/skies/sky.png");
    this.load.atlas(
      "NinjaCat",
      "assets/sprites/JsonArrayCat.png",
      "assets/sprites/JsonArrayCat.json",
      { frameWidth: 20, frameHeight: 48 }
    );
    this.load.image("ground", "assets/ground/spritesheet_ground.png");
    this.load.tilemapTiledJSON(
      "tilemap",
      "assets/maps/level1/FirstAttempt.json"
    );
    workBench.createFunction("jump", (jumpVelocity) =>
      this.player.setVelocityY(-jumpVelocity)
    );
  }

  function create() {
    this.add.image(400, 300, "sky").setScale(100);

    const map = this.make.tilemap({ key: "tilemap" });
    const tileSet1 = map.addTilesetImage("spritesheet_ground", "ground");
    const ground = map.createLayer("ground", tileSet1, 0, 0);

    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.player = this.physics.add.sprite(120, 980, "NinjaCat");
    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);

    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, ground);

    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.THREE
    );
    this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    this.seven = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SEVEN
    );
    this.eight = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.EIGHT
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "player-walk",
      framreate: 10,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 8,
        prefix: "NinjaCat_walk_0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "player-idle",
      framreate: 10,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 3,
        prefix: "NinjaCat_idle_0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "player-jump",
      framrate: 2,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 6,
        prefix: "NinjaCat_jump_0",
        suffix: ".png",
      }),
    });
    // setState((previous) => {
    //   return {...previous, counter: previous.counter + 1 }
    // }); //note, just a quick way to force a reload for the workbench
  }

  function update(now, delta) {
    let player = this.player;
    let horizontalVelocity = 0;

    // Check if the player is in the air
    let airControlFactor = player.body.onFloor() ? 1 : 0.2;

    if (this.cursors.left.isDown) {
      if (player.body.onFloor()) {
        player.setOffset(133, 20)
        player.body.setVelocityX(-500);
        player.anims.play("player-walk", true);
        player.setFlipX(true);
      } else {
        player.setFlipX(true);
        this.player.setOffset(133, 20)
        // Apply a smaller change in velocity for air control
        player.body.velocity.x -= 10;
      }
      
    }
    // Moving right
    else if (this.cursors.right.isDown) {
      if (player.body.onFloor()) {
        player.body.setVelocityX(500);
        player.setOffset(40, 20);
        player.anims.play("player-walk", true);
        player.setFlipX(false);
      } else {
        player.setFlipX(false);
        this.player.setOffset(40, 20);
        // Apply a smaller change in velocity for air control
        player.body.velocity.x += 10;
      }
      
      
    }
    // Idle state or air control
    else {
      if (player.body.onFloor()) {
        player.anims.play("player-idle", true);
        player.anims.msPerFrame = 500;
        player.body.setVelocityX(0); // Stop horizontal movement if not pressing left or right
      }
    }

    // Jumping
    if (this.cursors.up.isDown /*&& player.body.onFloor()*/) {
      player.body.setVelocityY(-500); // Apply vertical velocity to jump
      player.anims.play("player-jump", true);
    }

    // Cap the player's horizontal velocity to avoid unrealistic speeds
    player.body.velocity.x = Phaser.Math.Clamp(
      player.body.velocity.x,
      -500,
      500
    );

    if (this.one.isDown) {
      console.log("one");
    }
  }

  useEffect(() => {
    if (!state.loaded) {
      //if statement needed so that strictmode doesn't make 2 canvases
      console.log("render game");
      setState((previous) => {
        return { ...previous, loaded: true };
      });
      game = new Phaser.Game(gameConfig);
    }
  }, []);

  const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "phaser",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 800 },
        debug: true,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  return (
    <div className="mainWindow">
      <div className="App">{workBench.getReactBench()}</div>

      <div id="phaser"></div>
    </div>
  );
}

export default App;
