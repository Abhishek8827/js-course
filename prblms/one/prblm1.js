let count = 0;
let increment = function () {
  count++;
  document.getElementById("count-el").textContent = count;
};

let save = function () {
  let countStr = " " + count + " - ";
  document.getElementById("save-el").textContent += countStr;
  count = 0;
  document.getElementById("count-el").textContent = count;
};
