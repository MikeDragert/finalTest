import React from 'react';
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

import '../styles/WorkBench.css'


//the intent here is to have 8 key functions
// and also an array of potential objects

//const {PARAMTYPES, ObjectParameter, CodeObject, Operator, Number} = require('./CodeObject.js')
import {PARAMTYPES, ObjectParameter, CodeObject, CodeFunction, Operator, Number} from './CodeObject.js'

// and by building the objects together to create behaviour for a key
class WorkBench {
  _functions = []
  _function1;
  _codeObjectList = [];

  constructor(){
    //as a test...can I build one
    let plusOperator = new Operator();

    let number1 = new Number();
    let number2 = new Number();
    number1.setParamValue(200);
    number2.setParamValue(300);

    this.addCodeObjectToBench(plusOperator);
    this.addCodeObjectToBench(number1);
    this.addCodeObjectToBench(number2);
    //lets add 1 and 2
    this._codeObjectList[0].setParamValue(this._codeObjectList[1]);
    this._codeObjectList[0].setParamValue(this._codeObjectList[2]);
    
  }


  createFunction(name, callback) {
    let codeFunction = new CodeFunction(name, callback)
    this.addCodeObjectToBench(codeFunction)
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
      this._codeObjectList.push(codeObject);
      console.log(this._codeObjectList)
    }
  }

  handleDragEnd = function(event) {
    if (event.over && event.over.id === 'droppable') {
      //setIsDropped(true);
    }
  }

  //todo: need unique key
  getReactBench = function() {
    const {setNodeRef} = useDroppable({
      id: 'workbench-droppable',
    });
    
    return (
      <DndContext onDrageEnd={this.handleDragEnd}>
        <div ref={setNodeRef} id="droppable" className="workbench">
          {this._codeObjectList.map(codeObject => {
            return codeObject.reactDisplay()
          })}
        </div>
      </DndContext>
    )
    
  }

  execute1 = function() {
    this._codeObjectList[3].setParamValue(this._codeObjectList[1]);
    this._codeObjectList[3].execute();
  }
     
} 

let workBench = new WorkBench();

export default workBench;
