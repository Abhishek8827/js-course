//! primitive & non primitive

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
console.log(id === pen);

// non primitive also reference type => objects, array, functions

const languages = ["js", "node", "react"];

let myObj = {
  name: "Abhishek",
  age: 22,
};

const myFunction = function () {
  console.log("Hello World");
};

console.log(typeof (myObj, myFunction, languages));
