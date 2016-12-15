/**
 * Created by lewis.knoxstreader on 15/12/16.
 */

const matchUserAndTime = (x, y) =>
x.customer_id == y.customer_id && x.pickuptime == y.pickuptime;

const compareTimeAndUser = (x, y) =>
  (new Date(x.pickuptime) <= new Date(y.pickuptime) && x.customer_id == y.customer_id);

module.exports = {
  matchUserAndTime,
  compareTimeAndUser
};