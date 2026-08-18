// --- Introduction to Arrays ---
// Arrays are a fundamental data structure in JavaScript. They are a special type of object used for storing ordered collections of data. You can store elements of any type in an array—strings, numbers, booleans, objects, and even other arrays.

// --- Creating an Array ---
// The most common way to create an array is using array literal syntax [].

const myArr = [0, 1, 2, 3, 4, 5];
const heroes = ["Iron Man", "Captain America", "Thor"];
const mixedArray = [1, "hello", true, { name: "Tony" }];

// You can also use the Array constructor, though it's less common.
const myArr2 = new Array(1, 2, 3, 4);

console.log("Original Array:", myArr);
console.log("Heroes Array:", heroes);

// --- Accessing Elements ---
// Array elements are accessed using zero-based indexing.

console.log("First hero:", heroes[0]); // Output: Iron Man
console.log("Second element of myArr:", myArr[1]); // Output: 1

// --- Common Array Methods ---

// 1. push() & pop() - Modifying the end of an array
// push(): Adds one or more elements to the end of an array and returns the new length.
heroes.push("Hulk");
console.log("After push('Hulk'):", heroes); // ["Iron Man", "Captain America", "Thor", "Hulk"]

// pop(): Removes the last element from an array and returns that element.
const poppedHero = heroes.pop();
console.log("Popped Hero:", poppedHero); // Hulk
console.log("After pop():", heroes); // ["Iron Man", "Captain America", "Thor"]

// 2. unshift() & shift() - Modifying the beginning of an array
// unshift(): Adds one or more elements to the beginning of an array and returns the new length.
myArr.unshift(99);
console.log("After unshift(99):", myArr); // [99, 0, 1, 2, 3, 4, 5]

// shift(): Removes the first element from an array and returns that element.
const shiftedValue = myArr.shift();
console.log("Shifted Value:", shiftedValue); // 99
console.log("After shift():", myArr); // [0, 1, 2, 3, 4, 5]

// 3. includes() & indexOf() - Searching in an array
// includes(): Returns true if an array contains a certain value, and false otherwise.
console.log("Does myArr include 3?", myArr.includes(3)); // true
console.log("Does myArr include 9?", myArr.includes(9)); // false

// indexOf(): Returns the first index at which a given element can be found in the array, or -1 if it is not present.
console.log("Index of 4 in myArr:", myArr.indexOf(4)); // 4
console.log("Index of 9 in myArr:", myArr.indexOf(9)); // -1

// 4. join() - Converting an array to a string
// join(): Joins all elements of an array into a string. You can specify a separator.
const newStringFromArray = myArr.join();
console.log("Joined array (default separator ','):", newStringFromArray); // "0,1,2,3,4,5"
console.log(typeof newStringFromArray); // string

const dashedString = heroes.join(" - ");
console.log("Joined heroes with ' - ':", dashedString); // "Iron Man - Captain America - Thor"

// 5. slice() & splice() - Important distinction!

// slice(startIndex, endIndex): Returns a shallow copy of a portion of an array into a new array object.
// It does NOT modify the original array. The `endIndex` is not included.
const originalArray = [0, 1, 2, 3, 4, 5];
console.log("Original Array:", originalArray);

const slicedArray = originalArray.slice(1, 4); // Slices from index 1 up to (but not including) index 4
console.log("Sliced Array (slice(1, 4)):", slicedArray); // [1, 2, 3]
console.log("Original Array after slice():", originalArray); // [0, 1, 2, 3, 4, 5] (Unchanged)

// splice(startIndex, deleteCount, item1, item2, ...): Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
// It MODIFIES the original array.
const arrayToSplice = [0, 1, 2, 3, 4, 5];
console.log("Array to Splice:", arrayToSplice);

const splicedElements = arrayToSplice.splice(1, 3); // Removes 3 elements starting from index 1
console.log("Spliced Elements (splice(1, 3)):", splicedElements); // [1, 2, 3]
console.log("Array after splice():", arrayToSplice); // [0, 4, 5] (Changed!)

// --- Merging Arrays ---
const marvel_heroes = ["Thor", "Iron Man", "Spiderman"];
const dc_heroes = ["Superman", "Flash", "Batman"];

// Using concat() - returns a new array, does not modify existing arrays.
const all_heroes_concat = marvel_heroes.concat(dc_heroes);
console.log("Concatenated heroes:", all_heroes_concat);

// Using the Spread Operator (...) - modern and often preferred way.
const all_heroes_spread = [...marvel_heroes, ...dc_heroes];
console.log("Spread operator heroes:", all_heroes_spread);

// --- More Advanced Concepts (to explore next) ---
// - Array Iteration methods: forEach(), map(), filter(), reduce()
// - flat(): Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
// - Array.from() and Array.of()

const anotherArray = [1, 2, 3, [4, 5], 6, [7, 8, [9, 10]]];
const flattedArray = anotherArray.flat(Infinity); // The depth level specifying how deep a nested array structure should be flattened. Infinity flattens all levels.
console.log("Flatted Array:", flattedArray);

console.log(Array.isArray("Abhishek")); // false
console.log(Array.from("Abhishek")); // ['A', 'b', 'h', 'i', 's', 'h', 'e', 'k']

let score1 = 100;
let score2 = 200;
let score3 = 300;
console.log(Array.of(score1, score2, score3)); // [100, 200, 300]
