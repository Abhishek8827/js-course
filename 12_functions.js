//Functions Definition -

//Function is a block of code that performs a specific task and can be reused throughout the program. Functions help in organizing code, making it more readable and maintainable.

// Function to add two numbers

// function addNumbers(a, b) {

// return a + b; // when we use return we can assign the return value to a variable and use it later in the program. If we don't use return, the function will return undefined and we can't use the value later in the program.

// after using return statement, the function will exit and any code after the return statement will not be executed.

// console.log("Abhishek"); //unraechable code after return statement & console.log will not be executed
// }

// addNumbers(5, 10); // Returns 15

// console.log(addNumbers(2,5)); //using the return value of the function in console.log

// console.log("Addition of 5 and 3 is: " + addNumbers(5, "3")); // Returns 53 (string concatenation)

function loginUserMsg(username = "User", isLoggedIn = true) {
  //assign default values to parameters
  if (isLoggedIn) {
    return `Welcome ${username}!`;
  } else {
    return "Please log in to continue.";
  }
}

// console.log(loginUserMsg("Abhishek", true)); // Returns "Welcome Abhishek!"

// console.log(loginUserMsg("Abhishek", false)); // Returns "Please log in to continue."
// console.log(loginUserMsg()); // Returns "Welcome User!"

// console.log() // returns undefined because we are not passing any arguments to the function and the default values are used.

// Function to calculate the area of a rectangle
function calculateRectangleArea(length, width) {
  return length * width;
}
// console.log(
//   "Area of rectangle with length 5 and width 10 is: " +
//     calculateRectangleArea(5, 10),
// ); // Returns 50

// calculateRectangleArea //reference to the function

// calculateRectangleArea() //function call

// Fucntion to find lcm of two numbers
function lcm(a, b) {
  let max = a > b ? a : b;

  while (max % a !== 0 || max % b !== 0) {
    max++;
  }

  return max;
}

console.log(lcm(4, 6)); // 12
