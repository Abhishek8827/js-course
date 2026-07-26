//  *************************** Convertion ******************

let height = "hitu";

// console.log(typeof height);

let valueInNumber = Number(height);

// console.log(typeof valueInNumber);
// console.log(valueInNumber);
// to number Number()
// "33" => 33
// "3a" => NaN
// true => 1, falso => 0

// to boolean Boolean()
// 1 -> true, 0 -> false
// "" -> false
// "Hello" -> true

// to string String()
// to bigint BigInt()

// ************************** Operations ******************
let value = 3;
let nagValue = -value;
// console.log(nagValue);

let str1 = "Abhishek";
let str2 = " Wani";
const userName = str1 + str2;
// console.log(userName);

// console.log("1" + 2);
// console.log(1 + "2");
// console.log("1" + 2 + 3);
// console.log(1 + 2 + "3");

let a = 5;
let b = 5;

let result = a++ + ++b;
// 1. Postfix/Prefix execute first:
//    a++ evaluates to 5 (but changes 'a' to 6 in memory)
//    ++b changes 'b' to 6 and evaluates to 6
// 2. Binary addition runs last:
//    5 + 6 = 11

console.log(result); // 11
