// object declaration - literal const acc_user={} / constructor (singeltone) - Object.create
const mySmbl = Symbol("power");
const acc_users = {
  name: "Abhishek",
  age: 24,
  address: "Nepanagar",
  isAccActive: true,
  lastTransaction: ["Monday", "Tuesday"],
  email: "tvs@gmail.com",
  degree: "B-Tech",
  [mySmbl]: "power1",
};

// Object.freeze(acc_users);
// acc_users.email = "tvsm@gmail.com";
// console.log(acc_users.age);
// console.log(acc_users.email);
// console.log(acc_users["degree"]);
// console.log(typeof acc_users[mySmbl]); //?????

acc_users.greeting = function () {
  console.log("Hello World1!");
};

acc_users.degree = function () {
  console.log(`Hello World1! ${this.name}`); //use this to access object elements...
};

console.log(acc_users.degree());
console.log(acc_users.greeting());
