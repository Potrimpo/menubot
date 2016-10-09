import React, { PropTypes } from 'react'

const Posts = ({ orders }) => (
  <ul>
    {orders.map((order, i) =>
      <li key={i}>{order.size} | {order.type} | {order.item}</li>
    )}
  </ul>
);

Posts.propTypes = {
  orders: PropTypes.array.isRequired
};

export default Posts
