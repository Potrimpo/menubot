import React, { PropTypes } from 'react'
import Order from './Order'

const OrdersList = ({ fbid, orders, onOrderClick }) => (
  <div style={{margin: "0 5px 0 5px"}}>
    {orders.map((order, i) =>
      <Order
        key={order.orderid}
        child={lookback(orders, order, i)}
        {...order}
        pickuptime={timeFormatting(order.pickuptime)}
        onClick={() => onOrderClick(fbid, order.customer_id, order.pickuptime)}
        classing={ordering(orders, order)}
      />
    )}
  </div>
);

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  onOrderClick: PropTypes.func.isRequired
};

export default OrdersList

function timeFormatting (pickuptime) {
  pickuptime = new Date(pickuptime);
  let hours = pickuptime.getHours(),
    minutes = pickuptime.getMinutes();

  hours = hours > 10 ? hours : `0${hours}`;
  minutes = minutes > 10 ? minutes : `0${minutes}`;

  return `${hours}: ${minutes}`;
}

function lookback (orders, o, i) {
  if (i == 0) return false;
  return o.userid === orders[i -1].userid && o.pickuptime === orders[i - 1].pickuptime;
}

function ordering (orders, order) {
  const classes = `col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12`;
  const groupedContainer = position => `order-${position}-container`;
  const appendClass = str =>
    classes.concat(" ").concat(groupedContainer(str));

  const matchUserAndTime = (x, order) =>
    x.pickuptime == order.pickuptime && x.customer_id == order.customer_id;

  const alike = orders.filter(x => matchUserAndTime(x, order));

  const index = alike
    .map(x => x.orderid)
    .indexOf(order.orderid);

  const assignClass = (index, alike) => {
    if (alike.length == 1) {
      return appendClass("alone");
    }
    else if (index == 0) {
      return appendClass("top");
    }
    else if (index+1 == alike.length) {
      return appendClass("bottom");
    }
    else {
      return appendClass("mid");
    }
  };

  return assignClass(index, alike)
}
