/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const { ordersByFbid, orderComplete } = require('../repositories/site/CompanyRepository');

exports.retrieveOrders = (req, res) => {
  return ordersByFbid(req.params.fbid, today())
    .then(orders => {
      console.log("orders ==", orders);
      return res.json(orders)
    })
    .catch(err => res.status(500).send('error getting orders'));
};

exports.setOrderComplete = (req, res, next) => {
  return orderComplete(req.body.orderid)
    .then(data => next())
    .catch(err => console.error("error in setOrderComplete", err));
};

function today () {
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
