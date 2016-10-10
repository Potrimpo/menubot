import React, { PropTypes } from 'react'

const Posts = ({ orders }) => (
  <ul>
    {orders.map((order, i) =>
      <li key={i}>
        <div>
          <img src="https://graph.facebook.com/>/picture?type=large"></img>
          <img src="typeid"></img>
          <span>{order.size} | {order.type} | {order.item}</span>
        </div>
      </li>
    )}
  </ul>
);

Posts.propTypes = {
  orders: PropTypes.array.isRequired
};

export default Posts
