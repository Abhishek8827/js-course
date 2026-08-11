let myDate = new Date();
console.log("myDate:", myDate);
console.log("myDate.getFullYear():", myDate.getFullYear());
console.log("myDate.getMonth():", myDate.getMonth() + 1); // Month is zero-indexed
console.log("myDate.getDate():", myDate.getDate()); // Day of the month
console.log("myDate.getDay():", myDate.getDay()); // Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
console.log("myDate.getHours():", myDate.getHours()); // Hours (0-23)
console.log("myDate.getMinutes():", myDate.getMinutes()); // Minutes (0-59)
console.log("myDate.getSeconds():", myDate.getSeconds()); // Seconds (0-59)
console.log("myDate.getMilliseconds():", myDate.getMilliseconds()); // Milliseconds (0-999)
console.log("myDate.getTime():", myDate.getTime()); // Time in milliseconds since Unix epoch
console.log("myDate.toLocaleString():", myDate.toLocaleString()); // Local date and time string
console.log("myDate.toISOString():", myDate.toISOString()); // ISO 8601 date string
console.log("myDate.toJSON():", myDate.toJSON()); // JSON representation of the date
console.log("myDate.toString():", myDate.toString()); // Human-readable string representation of the date
console.log("myDate.toUTCString():", myDate.toUTCString()); //  UTC string representation of the date

// practice date and time
const currentDate = new Date();
console.log("Current Date:", currentDate);
const currentYear = currentDate.getFullYear();
console.log("Current Year:", currentYear);
const currentMonth = currentDate.getMonth() + 1;
console.log("Current Month:", currentMonth);
const currentDay = currentDate.getDate();
console.log("Current Day:", currentDay);
const currentHours = currentDate.getHours();
console.log("Current Hours:", currentHours);

let myCreateDate = new Date(1 - 14 - 2023); // June 14, 2023, 00:00:00
console.log("myCreateDate:", myCreateDate);
console.log("myCreateDate.getFullYear():", myCreateDate.getFullYear());
console.log("myCreateDate.getMonth():", myCreateDate.getMonth() + 1); // Month is zero-indexed
console.log("myCreateDate.getDate():", myCreateDate.getDate()); // Day of the month
