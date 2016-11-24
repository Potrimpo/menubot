/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const db = require("../repositories/site/CompanyRepository");

exports.retrieveOrders = (req, res) => {
  return db.ordersByFbid(req.params.fbid, today())
    .then(orders => res.json(orders))
    .catch(err => {
      console.log("error getting orders", err);
      res.status(500).send("error getting orders")
    });
};

exports.setOrderComplete = (req, res, next) => {
  return db.orderComplete(req.body.orderid)
    .then(data => res.status(200).send())
    .catch(err => {
      console.log("error setting orders", err);
      return res.status(500).send("error setting orders")
    });
};

function today () {
  const today = new Date();
  let dd = today.getDate(),
    mm = today.getMonth() + 1, //January is 0!
    yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  // start of the day (00's) & nz timezone (+13)
  return `${yyyy}-${mm}-${dd} 00:00:00+13`;
}
