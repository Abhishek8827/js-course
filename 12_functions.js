// //Functions Definition -
// //Function is a block of code that performs a specific task and can be reused throughout the program. Functions help in organizing code, making it more readable and maintainable.

// // Function to add two numbers
// function addNumbers(a, b) {
// return a + b; // when we use return we can assign the return value to a variable and use it later in the program. If we don't use return, the function will return undefined and we can't use the value later in the program.

// console.log("Abhishek"); //unraechable code
// }
// // addNumbers(5, 10); // Returns 15

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
console.log(loginUserMsg()); // Returns "Welcome User!"
