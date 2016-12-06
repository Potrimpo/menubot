import React, { PropTypes } from 'react'
import Order from './Order'

const OrdersList = ({ fbid, orders, onOrderClick }) => (
  <div>
    {orders.map((order, i) =>
      <Order
        key={order.orderid}
        child={lookback(orders, order, i)}
        {...order}
        pickuptime={timeFormatting(order.pickuptime)}
        onClick={() => onOrderClick(fbid, order.customer_id, order.pickuptime)}
        classing={ordering(orders, order, i)}
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
};

function ordering (orders, order,  i) {
  function alikeFiltering (array) {
    if (array.pickuptime == order.pickuptime && array.customer_id == order.customer_id) {
      return true
    } else {
      return false
    }
  }

  var alike = orders.filter(alikeFiltering);

  for (var i = 0; i < alike.length; i += 1) {
    if(alike[i].orderid === order.orderid) {
      var position = i;
    }
  };

  var adding;

  if (alike.length == 1) {
    adding = "alone"
  } else if (position == 0) {
    adding = "top"
  } else if (position+1 == alike.length) {
    adding = "bottom"
  } else {
    adding = "mid"
  }

  return `col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 order-${adding}-container`
}
