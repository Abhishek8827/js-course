const score = 450.05;
// console.log(typeof score, score);
// console.log(score.toString());

const score1 = new Number(100); //creates a Number object rather than a primitive number value. Mostly Avoided
// console.log(score1);

// console.log(score.toPrecision(5));
// console.log(score.toLocaleString("en-US"));
// console.log(score.toString().length);
// console.log(score.toFixed(1));

// let grid = [["b", "c"]];
// grid[0].unshift(["a", "abhi"]); // Target row 0, add to front
// console.log(grid); // Output: [ ["a", "b", "c"] ]

// let grid = [["a", "b"]];
// grid.push("c"); // Adds a new row at the end
// console.log(grid); // Output: [ ["a", "b"], ["c", "d"] ]

// +++++++++++++++++++ Maths +++++++++++++++++++++
console.log("Math:", Math);
console.log("Math.PI:", Math.PI);
console.log("Math.E:", Math.E);
console.log("Math.round(4.7):", Math.round(4.7));
console.log("Math.ceil(4.2):", Math.ceil(4.2));
console.log("Math.floor(4.9):", Math.floor(4.9));
console.log("Math.abs(-4):", Math.abs(-4));
console.log("Math.sqrt(16):", Math.sqrt(16));
console.log("Math.pow(2, 3):", Math.pow(2, 3));
console.log("Math.min(1, 2, 3, 4, 5):", Math.min(1, 2, 3, 4, 5));
console.log("Math.max(1, 2, 3, 4, 5):", Math.max(1, 2, 3, 4, 5));
console.log("Math.random():", Math.random());
console.log(
  "Random number between 1 and 10:",
  Math.floor(Math.random() * 10) + 1,
); // Random number between 1 and 10 & +1 for to add to 0 if 0 is randomly generated there

const min = 10;
const max = 20;
const randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // Random number between min and max (inclusive)
console.log(`Random number between ${min} and ${max}:`, randomNum);
