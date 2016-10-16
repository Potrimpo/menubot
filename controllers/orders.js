/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const { getOrders, orderComplete } = require('../repositories/CompanyRepository');

exports.retrieveOrders = (req, res, next) => {
  const today = dateParsing();
  return getOrders(req.params.fbid, today)
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

  return `${yyyy}-${mm}-${dd}`;
}