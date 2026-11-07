// nested objects
const web_user = {
  email: "abc@gmail.com",
  fullname: {
    firstname: "Abhishek",
    lastname: "Wani",
  },
};

// console.log(web_user.fullname.firstname);

// merge objects
const obj1 = {
  name: "Abhishek",
  age: 24,
};

const obj2 = {
  address: "Nepanagar",
  email: "abc@gmail.com",
};

// const mergedObj = { obj1, obj2 };
const mergedObj = Object.assign({}, obj1, obj2); // using Object.assign (target, source1, source2, ...)
// const mergedObj = { ...obj1, ...obj2 }; // using spread operator
// const mergedObj = { ...obj1, ...obj2, email: "xyz@gmail.com" }; // using spread operator with overriding email property
// console.log(mergedObj);

// console.log(Object.keys(obj1)); // returns an array of keys of the object
// console.log(Object.values(obj1)); // returns an array of values of the object
// console.log(Object.entries(obj1)); // returns an array of key-value pairs of the object

// console.log(obj1.hasOwnProperty("name")); // returns true if the object has the specified property

const dbUsers = [
  {
    id: 1,
    firstname: "Abhishek",
  },
  {
    id: 2,
    firstname: "Abhishek",
  },
  {
    id: 3,
    firstname: "Abhishek",
  },
  {
    id: 4,
    firstname: "Abhishek",
  },
];

dbUsers[1].email;

// destructuring objects
const { age: umar } = obj1; // destructuring objects with renaming the variable
// console.log(umar);

//react pros. ki place pr {umar} use kr skte h instead of obj1.age

//API - Application Programming Interface
//json
[{}, {}, {}];
