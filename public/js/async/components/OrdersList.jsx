import React, { PropTypes } from 'react'
import Order from './Order'

const OrdersList = ({ orders, onOrderClick }) => (
  <ul>
    {orders.map((order, i) =>
      <Order
        key={order.orderid}
        {...order}
        onClick={() => onOrderClick(order.orderid)}
      />
    )}
  </ul>
);

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  onOrderClick: PropTypes.func.isRequired
};

export default OrdersList
