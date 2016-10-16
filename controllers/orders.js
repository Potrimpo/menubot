/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const { getOrders, orderComplete } = require('../repositories/CompanyRepository');

exports.retrieveOrders = (req, res, next) => {
  return getOrders(req.params.fbid)
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
