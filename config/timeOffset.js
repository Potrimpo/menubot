var offsetThis = function (time) {
  var targetTime = time;
  var timeZoneFromDB = parseFloat(process.env.timeZoneOffset);
  console.log("Requested timezone to move to:");
  console.log(timeZoneFromDB); //time zone value from database
  //get the timezone offset from local time in minutes
  console.log("Server's current timezone:");
  console.log(targetTime.getTimezoneOffset());
  var tzDifference = timeZoneFromDB - targetTime.getTimezoneOffset();
  console.log("The difference between the two:");
  console.log(tzDifference);
  //convert the offset to milliseconds, add to targetTime, and make a new Date
  console.log("The new, offset date: ");
  console.log(new Date(targetTime.getTime() + tzDifference * 60 * 1000));
  return new Date(targetTime.getTime() + tzDifference * 60 * 1000);
};


module.exports = {
  offsetThis
};
