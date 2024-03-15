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
  execute = function(player) {
    return 0;
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {
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

//module.exports = {PARAMTYPES, ObjectParameter, CodeObject, Operator, Number}
export {PARAMTYPES, ObjectParameter, CodeObject};