import {PARAMTYPES, ObjectParameter, CodeObject} from './CodeObject.js'
import Draggable from './Draggable.js';

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
  execute = function(player) {
    return this.callback(player, this._params[1].value)
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {

    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-function',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };
  

    // <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="codeBlock-Function">{this._params[0].value}({this._params[1].value})</button>
    return (
      <Draggable  this={this} currentContainerName={currentContainerName} id="cf1" className="codeBlock-Function">{this._params[0].value}({this._params[1].value})</Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value} + ${this._params[1].name}: ${this._params[1].value}`;
  }
}

export {CodeFunction};