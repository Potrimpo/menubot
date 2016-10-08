import React, { PropTypes } from 'react'

const Posts = ({ orders }) => (
  <ul>
    {orders.map((item, i) =>
      <li key={i}>{item.title}</li>
    )}
  </ul>
);

Posts.propTypes = {
  orders: PropTypes.array.isRequired
};

export default Posts
