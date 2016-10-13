import React, { PropTypes } from 'react'

const Order = ({ onClick, pending, type, size, item, userid, pickuptime }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: pending ? 'none' : 'line-through'
    }}
  >
    <img src={`https://graph.facebook.com/${userid}/?fields=profile_pic%access_token=EAAP0Oze8Cs0BAKbVdE716FjxC8uJjJSgbTiTSt3vbvsOtSQxFp6Fhv2Bxyi2HaM0t4068MXaS8TiaUkMXnpTlwZAH8xNAHwz3gmfwZAfZAIZAQxiHkSK3vWshzgGECpHXnOWbvD8lReYlx4dUb1h4VnMU1z3mCksRZAV5blqZB1wZDZD`}></img>
    <img src="typeid"></img>
    <span>{size} | {type} | {item} @ {pickuptime}</span>
  </li>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
