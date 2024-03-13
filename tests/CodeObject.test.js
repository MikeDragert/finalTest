const {PARAMTYPES, ObjectParameter, CodeObject, Operator, Number} = require('../components/CodeObject.js')


let plusOperator = new Operator();

let number1 = new Number();
let number2 = new Number();
number1.setParamValue(5);
number2.setParamValue(2);
console.log(number1.toString())
console.log(number2.toString())


plusOperator.setParamValue(number1);
plusOperator.setParamValue(number2);

console.log(plusOperator.toString());
console.log(plusOperator.execute());