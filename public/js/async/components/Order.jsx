import React, { PropTypes } from 'react'

const Order = ({ onClick, pending, photo, type, size, item, userid, pickuptime }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: pending ? 'none' : 'line-through'
    }}
  >
    <img src="user photo"></img>
    <img src={photo}></img>
    <span>{size} | {type} | {item} @ {pickuptime}</span>
  </li>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
