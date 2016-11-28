import React, { PropTypes } from 'react'

const Order = ({onClick, pending, child, type, size, item, userid, pickuptime, profile_pic, customer_name }) => (
  <div onClick={onClick} className="row">
    <div
      className="col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 order-basic-container"
      style={ pending ? {backgroundColor:"#e0e0e0", border: "1px solid #b5b5b5" } : {backgroundColor:"#f2f2f2", border: "1px solid #e8e8e8"} }
    >
      <div className="row">
        <div className="order-content-container">
          { item ? <p className="order-text">- {item}</p> : null }
          { type ? <p className="order-text">- {type}</p> : null }
          { size ? <p className="order-text">- {size}</p> : null }
        </div>
      </div>

      <div className="order-line"></div>

      { child ? null :
        <div className="row">
          <div className="order-content-container">
            <img className="order-photo" src={profile_pic}/>
          </div>
          <div className="order-content-container">
            <p className="order-text"><strong>{customer_name}</strong></p>
            <p className="order-text">@: <strong>{pickuptime}</strong></p>
          </div>
        </div>
      }
    </div>
  </div>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
