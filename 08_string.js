// strings in js

let userName = "Aman ";
let lastName = " Ram";
let age = 50;

console.log(userName + age + lastName + " " + "Ok"); // not to use it was outdated
console.log(`Hello my name is ${userName} ${lastName} and my age is: ${age}`); //best to use backticks as litereal, string interpolation, modern usage

// console.log("Freind's");

const fatherName = new String("  Rajesh    ");
// console.log(fatherName.toUpperCase());
console.log(fatherName.charAt(2));
console.log(fatherName.indexOf("a"));

// const newString = fatherName.slice(-4);
// console.log(fatherName.trim()); // works on on whitespaces and also has trimEnd & trimStart

const url = "https://google.com/javascript%20course";
console.log(url.replace("%20", "-"));

console.log(url.includes("google"));

const movie = "RRR-Singham Krukishetra";
console.log(movie.blink());
