import React, { PropTypes } from 'react'

const Order = ({ onClick, pending, photo, type, size, item, pickuptime, userid, profile_pic, customer_name }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: pending ? 'none' : 'line-through'
    }}
  >
    <div>
      <img src={profile_pic} className="orders-list-photo"/>
      <img src={photo} className="orders-list-photo"/>
      <span>{size} | {type} | {item} @ {pickuptime}</span>
      <br/>
      <span>{customer_name}</span>
    </div>
  </li>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
