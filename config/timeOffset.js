var moment = require('moment-timezone');

var offsetThis = function (time, timeZone) {
  return moment(time).tz(timeZone).toDate();
};


module.exports = {
  offsetThis
};
