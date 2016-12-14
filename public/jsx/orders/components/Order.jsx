import React, { PropTypes } from 'react'

const Order = ({onClick, classing, pending, child, type, size, item, userid, pickuptime, profile_pic, customer_name }) => (
  <div onClick={onClick} className="row">
    <div
      className={classing}
      style={
        pending ? {backgroundColor:"#e0e0e0", borderColor: "#b5b5b5" } :
        {backgroundColor:"#f2f2f2", borderColor: "#e8e8e8"}
      }
    >
      { child ? null :
        <div className="row">
          <div className="order-content-container">
            <img className="order-photo" src={profile_pic}/>
          </div>
          <div className="order-content-container">
            <p className="big-order-text"><strong>{customer_name}</strong></p>
            <p className="big-order-text">@: <strong>{pickuptime}</strong></p>
          </div>
        </div>
      }

      { child ? null : <div className="order-line"></div> }

      <div className="row">
        <div className="order-content-container">
          <p className="order-text">
            { item ? <span>- {item}</span> : null }
            { type ? <span>, {type}</span> : null }
            { size ? <span>, {size}</span> : null }
          </p>
        </div>
      </div>
    </div>
  </div>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
