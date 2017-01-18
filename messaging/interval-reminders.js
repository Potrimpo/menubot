const moment = require('moment-timezone'),
  db = require('../repositories/site/CompanyRepository.js'),
  { basicReplies } = require('./quick-replies.js'),
  fbMessage = require('./fbMessage'),
  { groupBy, map, intersperse, prepend } = require('ramda');

const intervalReminders = (minutes) => {
  const now = moment.tz('Europe/London').format('YYYY-MM-DD H:mm:s');
  const inTheFuture = moment.tz('Europe/London').add(minutes, "minutes").format('YYYY-MM-DD H:mm:s');

  db.ordersByTime(now, inTheFuture)
    .then(orders => {
      const byCustomerId = groupBy(order => order.customer_id)
      const groupedOrders = byCustomerId(orders)
      map((orders) => {
        const orderStrings = intersperse("\n",
          prepend(
            `The following orders will be ready in ${minutes} minutes: `,
            map((order) => {
              db.orderNotified(order.orderid);
              if (order.type == null) {return `-${order.item}`}
              else if (order.size == null) {return `-${order.type}, ${order.item}`}
              else {return `-${order.size}, ${order.type}, ${order.item}`}
            } , orders)
          )
        );
        const message = {
          quick_replies: basicReplies,
          text: orderStrings.join("")
        };
        fbMessage(orders[0].customer_id, orders[0].access_token, message);
      }, groupedOrders);
    })
    .catch((err) => {
      console.log("Error sending order reminders in intervalReminders(): ", err);
    })
};

module.exports = intervalReminders;
