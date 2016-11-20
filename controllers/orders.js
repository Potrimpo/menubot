/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const { ordersByFbid, orderComplete } = require('../repositories/site/CompanyRepository');

// express routes
exports.retrieveOrders = (req, res, next) => {
  const today = dateParsing();
  return ordersByFbid(req.params.fbid, today)
    .then(data => {
      req.orders = data;
      return next();
    })
    .catch(err => res.status(500).send('error getting orders'));
};

exports.setOrderComplete = (req, res, next) => {
  return orderComplete(req.body.orderid)
    .then(data => next())
    .catch(err => console.error("error in setOrderComplete", err));
};

// universally callable functions
exports.fetchOrders = fbid => {
  const today = dateParsing();
  return ordersByFbid(fbid, today)
    .catch(err => res.status(500).send('error getting orders'));
};

function dateParsing () {
  const today = new Date();
  let dd = today.getDate(),
    mm = today.getMonth() + 1, //January is 0!
    yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  }

  if(mm<10) {
    mm='0'+mm
  }

  // start of the day (00's) & nz timezone (+13)
  return `${yyyy}-${mm}-${dd} 00:00:00+13`;
}
