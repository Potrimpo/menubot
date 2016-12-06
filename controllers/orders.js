/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const db = require("../repositories/site/CompanyRepository");

// universally callable functions
exports.fetchOrders = fbid =>
  db.ordersByFbid(fbid, today())
    .catch(err => res.status(500).send('error getting orders'));

exports.setOrderComplete = (fbid, customer_id, pickuptime) =>
  db.orderComplete(fbid, customer_id, pickuptime)
    .catch(err => console.log("error setting orders", err));

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
