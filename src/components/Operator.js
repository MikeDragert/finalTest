import {PARAMTYPES, ObjectParameter, CodeObject} from './CodeObject.js'
import Draggable from './Draggable.js';

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
  execute = function(player) {
    return this._params[0].value + this._params[1].value;
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-operator',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };

    return (
      <Draggable this={this} currentContainerName={currentContainerName} id="op1" className="codeBlock-Operator">{this._params[0].value} + {this._params[1].value}</Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value} + ${this._params[1].name}: ${this._params[1].value}`;
  }
}

export {Operator};