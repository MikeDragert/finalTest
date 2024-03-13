import React from 'react';
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';


// All possible code object types.
const PARAMTYPES = {
  UNKNOWN: "Unknown",  //not exactly a valid type, but used in the base Class
  NUMBER: "Number",
  STRING: "String",
  BOOLEAN: "Boolean",
  ARRAY: "Array",
  NONE: "None"
}

class ObjectParameter {
  _name = "name"
  _type = undefined;
  _defaultValue = undefined;
  _value = undefined;
  
  constructor(name, type, defaultValue) {
    this._name = name;
    this._type = type;
    this._defaultValue = defaultValue;
  };

  get name() {
    return this._name;
  }

  get value() {
    if (this._value) {
      if (this._value instanceof CodeObject) {
        return this._value.execute();
      } else {
        return this._value;
      }
    } 
    return this._defaultValue;
  }

  get type() {
    return this._type;
  }

  set value(value) {
    //todo:
    //check is class or a number
    //check is proper type
    this._value = value;
  }

  clearValue = function() {
    this._value = undefined;
  }

  getValueObject = function() {
    return this._value;
  }

  hasValue = function() {
    return this._value !== undefined;
  }
}

//base CodeObject.  All objects will inherit from this!
class CodeObject {

  _params = [];  
  _returnType = PARAMTYPES.UNKNOWN;
  _used = 0;

  constructor() {
  };

  setParamValue = function(codeObject, position = -1) {
    if (codeObject instanceof CodeObject){
      let updatePosition = -1;
      if ((position >=0) && (position < this._params.length)) {
        updatePosition = position;
      }
      if ( updatePosition < 0) {
        this._params.some((param, index) => {
          if ((!param.hasValue()) && (codeObject.matchesType(param.type))) {
            updatePosition = index;
            return true;
          }
          return false;
        });
      }

      if (updatePosition >= 0) {
        this._params[updatePosition].value = codeObject;
        return true;
      }
    }
    return false;
  };

  matchesType = function(type) {
    return type === this._returnType;
  }

  clearParamValue = function(position = -1) {
    let updatePosition = -1;
    if ((position >=0) && (position < this._params.length)) {
      updatePosition = position;
    }
    if ( updatePosition < 0) {
      for(let index = this._params.length -1; index >= 0; index--){
        if (this._params[index].hasValue()) {
          updatePosition = index;
          break;  
        }
      }   
    }

    if (updatePosition >= 0) {
      let removedObject = this._params[updatePosition].getValueObject();
      this._params[updatePosition].clearValue();
      return removedObject;
    }
    return undefined;
  }

  // this will execute the logic of the code objects
  execute = function() {
    return 0;
  }

  //this will create a react object to display
  reactDisplay = function () {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };
    // <div ref={setNodeRef} style={style} {...listeners} {...attributes}>Base CodeObject</div>
    return (
      <div>Base CodeObject</div>
    );
  }

  //this can write it out as a text string 
  toString = function() {
    return "CodeObject"
  }
}

class Operator extends CodeObject {

  constructor() {
    super();
    this._params = [
      new ObjectParameter("value1", PARAMTYPES.NUMBER, 0),
      new ObjectParameter("value2", PARAMTYPES.NUMBER, 0)
    ];
    this._returnType = PARAMTYPES.NUMBER;
    console.log(this._params)
  };

  // this will execute the logic of the code objects
  execute = function() {
    return this._params[0].value + this._params[1].value;
  }

  //this will create a react object to display
  reactDisplay = function () {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-operator',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };

    return (
      <div  className="codeBlock-Operator">{this._params[0].value} + {this._params[1].value}</div>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value} + ${this._params[1].name}: ${this._params[1].value}`;
  }
}

class CodeFunction extends CodeObject {
  constructor(name, callback) {
    super();
    this.callback = callback;
    this._params = [
      new ObjectParameter("name", PARAMTYPES.STRING, ""),
      new ObjectParameter("value", PARAMTYPES.NUMBER, 0)
    ];
    this._returnType = PARAMTYPES.NONE;
    this._params[0].value = name;
  };

  // this will execute the logic of the code objects
  execute = function() {
    return this.callback(this._params[1].value)
  }

  //this will create a react object to display
  reactDisplay = function () {

    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-function',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };
  

    // <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="codeBlock-Function">{this._params[0].value}({this._params[1].value})</button>
    return (
      <div className="codeBlock-Function">{this._params[0].value}({this._params[1].value})</div>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value} + ${this._params[1].name}: ${this._params[1].value}`;
  }
}

class Number extends CodeObject {
  //todo:  we want some concept of a max, so that 0 to max are the only valid values for param[0]
  constructor() {
    super();
    this._params = [new ObjectParameter("value", PARAMTYPES.NUMBER, 0)];
    this._returnType = PARAMTYPES.NUMBER;
  };

  //todo: we can maybe dry this up
  // I have overriddent this, because it has to take an actual number and not a code object
  setParamValue = function(number, position = -1) {
    if (typeof number === 'number'){
      let updatePosition = -1;
      if ((position >=0) && (position < this._params.length)) {
        updatePosition = position;
      }
      if ( updatePosition < 0) {
        this._params.some((param, index) => {
          if (!param.hasValue()) {
            updatePosition = index;
            return true;
          }
          return false;
        });
      }

      if (updatePosition >= 0) {
        this._params[updatePosition].value = number;
        return true;
      }
    }
    return false;
  };


   // this will execute the logic of the code objects
   execute = function() {
    return this._params[0].value;
  }

  //this will create a react object to display
  reactDisplay = function () {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-number',
    // });

    return (
      <div className='codeBlock-Number'>{this._params[0].value}</div>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value}`;
  }
}

//module.exports = {PARAMTYPES, ObjectParameter, CodeObject, Operator, Number}
export {PARAMTYPES, ObjectParameter, CodeObject, CodeFunction, Operator, Number};