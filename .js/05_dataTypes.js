//! primitive & non primitive (preference)

// primitive 7 types => strings, number, boolean, null, undefined, bigInt, symbol
const username = "Abhishek";
const age = 22;
const voter = true;
const saving = null;
const marriage = undefined;
const accountNumber = 9518181445000000n;

// 1. Organize your variables into a list (array) of objects
const dataTable = [
  { Variable: "username", Value: username, Type: typeof username },
  { Variable: "age", Value: age, Type: typeof age },
  { Variable: "voter", Value: voter, Type: typeof voter },
  { Variable: "saving", Value: saving, Type: typeof saving },
  { Variable: "marriage", Value: marriage, Type: typeof marriage },
  {
    Variable: "accountNumber",
    Value: accountNumber.toString(),
    Type: typeof accountNumber,
  },
];
// console.table(dataTable);

const id = Symbol("1255");
const pen = Symbol("1255");
// both are diff. even same value because we use symbol
console.log(id === pen);

// non primitive also preference type => objects, array, functions.

// array:
const languages = ["js", "node", "react"];

// object: in the pair of key and value
let myObj = {
  name: "Abhishek",
  age: 22,
};

// funstion:
const myFunction = function () {
  console.log("Hello World");
};

console.log(typeof (myObj, myFunction, languages));

// ! static (before execution) v/s dynamic (while program running) := when type checking occur`s and how variables are declared.
// ? (js check error when program is running )
