import './App.css';
import {useEffect, useState} from 'react'
import workBench from './components/WorkBench.js';
import Phaser from 'phaser'
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';


function App() {
  let game;
  let playerSpeed = 2;
  
  const [state, setState] = useState({counter: 0, loaded: false});
  


  function preload() {
    this.load.setBaseURL('http://localhost:3000');
    this.load.image('sky', 'assets/skies/sky.png');
    this.load.spritesheet('player', 'assets/sprites/YeOldyNecroGuy.png', { frameWidth: 38, frameHeight: 38 });
    this.load.image('ground', 'assets/ground/37623_grass_ground.png');
    workBench.createFunction("jump", (jumpVelocity) => this.player.setVelocityY(-jumpVelocity));
  }

  function create() {
    this.add.image(400, 300, 'sky');
    this.player = this.physics.add.sprite(120,350,'player').setScale(4);
    this.player.setCollideWorldBounds(true)
    this.platforms = this.physics.add.staticGroup();
    this.platforms.physicsBodyType = Phaser.Physics.ARCADE;

    let ground = this.platforms.create(0, 600, 'ground').setScale(1);
    ground.body.setSize(2000,80)
    this.physics.add.collider(this.player, this.platforms);

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    this.seven = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
    this.eight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);

    
    // setState((previous) => {
    //   return {...previous, counter: previous.counter + 1 }
    // }); //note, just a quick way to force a reload for the workbench
  }

  function update(now, delta) {
    if (this.left.isDown) {
      this.player.x -= playerSpeed
    } else if (this.right.isDown) {
      this.player.x += playerSpeed
    }

    if ((this.spacebar.isDown) && (this.player.body.touching.down)) {
      // this.player.setVelocityY(-200);
      workBench.execute1();
    }

    if (this.one.isDown) {
      console.log('one')
    }

  }

  useEffect(() => {
    if (!state.loaded) {  //if statement needed so that strictmode doesn't make 2 canvases
      console.log('render game')
      setState((previous) => {
        return {...previous, loaded: true }
      })
      game = new Phaser.Game(gameConfig);
    } 
  }, []);

  const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
  }

  
  return (
    <div className="mainWindow">
      <div className="App">{workBench.getReactBench()}</div>
      
      <div id="phaser"></div>
    </div>
  );
}

export default App;
