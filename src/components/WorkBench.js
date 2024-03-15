import React from 'react';
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

import '../styles/WorkBench.css'


//the intent here is to have 8 key functions
// and also an array of potential objects

//const {PARAMTYPES, ObjectParameter, CodeObject, Operator, Number} = require('./CodeObject.js')
import {PARAMTYPES, ObjectParameter, CodeObject } from './CodeObject.js'
import {CodeFunction} from './CodeFunction.js'
import {Operator} from './Operator.js'
import {Number} from './Number.js'
import Droppable from './Droppable.js'
import Draggable from './Draggable.js'

// and by building the objects together to create behaviour for a key
class WorkBench extends React.Component {
  constructor(codeList, moveCodeObject, loaded, setLoaded, functionList){
    super();
    this.codeList = codeList;
    this.moveCodeObject = moveCodeObject;    
    this.loaded = loaded;
    this.setLoaded = setLoaded;
    
    if (!this.loaded) {
      //for a test, let's set up some params!
      let plusOperator = new Operator();

      let number1 = new Number();
      let number2 = new Number();
      number1.setParamValue(200);
      number2.setParamValue(300);

      plusOperator.setParamValue(number1);
      plusOperator.setParamValue(number2);

      this.addCodeObjectToBench(plusOperator);
      this.addCodeObjectToBench(number1);
      this.addCodeObjectToBench(number2);

      functionList.forEach(codeFunction => {
        this.createFunction(codeFunction.name, codeFunction.callback, [plusOperator]);
      });
      
      //this.codeList = this.updateCodeList({... this.codeList, loaded: true})
      setLoaded = this.setLoaded(true);
    }

  }

  execute1 = function(player) {
    this.codeList.keys[0][3].execute(player);
  }

  logMyCodeList = function() {
    console.log('My current codeList is', this.codeList)
  }

  createFunction(name, callback, params) {
    let codeFunction = new CodeFunction(name, callback)
    if (params) {
      params.forEach((param, index) => codeFunction.setParamValue(param, index+1));
    }
    this.addCodeObjectToBench(codeFunction)
  }

  setCodeList = function (newCodeList) {
    console.log('got updated codelist', newCodeList)
    this.codeList = {...newCodeList};
        console.log('I changed my codelist to', this.codeList)
    this.logMyCodeList()
    
  }

  // this._function1 = function() {
  

    //we need to be able to do two things with the final function
    // show the react objects
    // execute
  // }

    //we also need to list all the unused objects that are available still
    // we need to be able to drag the objects from the bench to the function
      //one at a time
        //drop operator
        // drop number 1
        // drop number 2
    // we need to be able to clear a function an return all to the workbench
      // later it would be nice to remove objects one at a time
  
    //need to be able to show the function for each hotkey
      //need to be able to drag objects from one side to the other

    //remember this is a proof of concept
    // lets do one function - basic build
    // and have it do SOMETHING in the game
    // use box sprite? show jump? shrink, grow?


  addCodeObjectToBench = function(codeObject) {
    if (codeObject instanceof CodeObject) {
      this.moveCodeObject(codeObject, undefined, 'bench')
    }
  }

  handleDragEnd = function(event) {
    if (event) {
      const {active, over} = event;
      if (active && over) {
        //console.log('Move',active.data.current.this, 'From', active.data.current.currentContainerName, 'To', over.data.current.id)
        this.moveCodeObject(active.data.current.this, active.data.current.currentContainerName, over.data.current.id)
      }
    }
  }

  //todo: need unique key
  getReactBench = function() {   
    return (
      <DndContext onDragEnd={(event) => this.handleDragEnd(event)}>
        <Droppable id="key1" className="workbench">
          {this.codeList.keys[1].map(codeObject => {
            return codeObject.reactDisplay("key1")
          })}
        </Droppable>
        <Droppable id="bench" className="workbench">
          {this.codeList.keys[0].map(codeObject => {
            return codeObject.reactDisplay("bench")
          })}
        </Droppable>
      </DndContext>
    )
  }
} 

export default WorkBench;
