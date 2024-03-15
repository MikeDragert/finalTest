import './App.css';
import {useEffect, useState, useReducer} from 'react'
import WorkBench from './components/WorkBench.js';
import Phaser from 'phaser'
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';


function App() {
  let game;
  let playerSpeed = 2;
  let gameScene = undefined;
  
  const [loaded, setLoaded] = useState(false);
  const [loadedGame, setLoadedGame] = useState(false);

  //array at 0 is the workbench
  // then keys 1 to 8
  const initialState = {
    keys: [[],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []],
    count: 0
  }

  const reducer = (state, action) => {
    let {fromIndex, toIndex, codeObject} = action.value;
    

    let newState = {keys: [...state.keys], count:state.count};
    let countChange = 0
    if ((fromIndex >= 0) && (fromIndex <= state.keys.length)) {
      countChange -= newState.keys[fromIndex].length;
      newState.keys[fromIndex] = newState.keys[fromIndex].filter(codeObj => codeObj !== codeObject); 
      countChange += newState.keys[fromIndex].length;
    }

    if ((toIndex >= 0) && (toIndex <= state.keys.length)) { // the filter seems unnecessary, but what it it is already in this list for some strange reason??
      countChange += newState.keys[toIndex].length;
      newState.keys[toIndex] = newState.keys[toIndex].filter(codeObj => codeObj !== codeObject); 
      newState.keys[toIndex].push(codeObject)
      countChange -= newState.keys[toIndex].length;
    }
    newState.count -= countChange;
    return newState;
  }

  const [codeList, dispatch] = useReducer(reducer, initialState)

  const getListNumber = function(listName) {
    if ((listName) && (listName.toLowerCase().startsWith('key'))) {    
      let keyNumber = Number(listName.toLowerCase().replace('key', ''));
      if ((keyNumber !== undefined) && (!Number.isNaN(keyNumber))) {
        return keyNumber;
      }
    }
    return undefined;
  }


  const moveCodeObject = function(codeObject, fromListName, toListName) {
    
    if ((fromListName) && (fromListName.toLowerCase() === 'bench')) {
      fromListName = 'key0';
    }
    if ((toListName) && (toListName.toLowerCase() === 'bench')) {
      toListName = 'key0';
    }
    let fromIndex = getListNumber(fromListName);
    let toIndex = getListNumber(toListName);

    dispatch({type: 'dont care', value: {fromIndex, toIndex, codeObject}});
  }




  const getFunctionList = function() {
    return [
      {name: "jump", callback: (player, jumpVelocity) => {
        player.setVelocityY(-jumpVelocity)
        return
      }}
    ];
  }

  let workBench = new WorkBench(codeList, moveCodeObject, loaded, setLoaded, getFunctionList());

  

  function preload() {
    gameScene = this;
    this.load.setBaseURL('http://localhost:3000');
    this.load.image('sky', 'assets/skies/sky.png');
    this.load.spritesheet('player', 'assets/sprites/YeOldyNecroGuy.png', { frameWidth: 38, frameHeight: 38 });
    this.load.image('ground', 'assets/ground/37623_grass_ground.png');
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

  }

  function update(now, delta) {
    if (this.left.isDown) {
      this.player.x -= playerSpeed
    } else if (this.right.isDown) {
      this.player.x += playerSpeed
    }

    if ((this.spacebar.isDown) && (this.player.body.touching.down)) {
      // this.player.setVelocityY(-200);
      workBench.execute1(this.player);
    }

    if (this.one.isDown) {
      console.log('one')
    }

  }

  useEffect(() => {
    if (!loadedGame) {  //if statement needed so that strictmode doesn't make 2 canvases
      console.log('render game')
      setLoadedGame(true);
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
      <div className="App">
        {workBench.getReactBench()}
      </div>      
      <div id="phaser"></div>
    </div>
  );
}

export default App;
