
import {PARAMTYPES, ObjectParameter, CodeObject} from './CodeObject.js'
import Draggable from './Draggable.js';

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
   execute = function(player) {
    return this._params[0].value;
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-number',
    // });

    return (
      <Draggable  this={this} currentContainerName={currentContainerName} id={`numb-${this._params[0].value}`} className='codeBlock-Number'>{this._params[0].value}</Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value}`;
  }
}

export {Number};