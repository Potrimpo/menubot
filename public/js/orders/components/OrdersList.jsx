import React, { PropTypes } from 'react'
import Order from './Order'

const OrdersList = ({ fbid, orders, onOrderClick }) => (
  <div>
    {orders.map((order, i) =>
      <Order
        key={order.orderid}
        {...order}
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
