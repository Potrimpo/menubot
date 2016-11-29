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
        onClick={() => onOrderClick(fbid, order.orderid)}
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
