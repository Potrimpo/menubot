import React, { PropTypes } from 'react'

const Order = ({onClick, pending, type, size, item, item_photo,type_photo, userid, pickuptime, profile_pic, customer_name }) => (
  <div onClick={onClick} className="row">
    <div className="col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 order-active-container">
      <div className="row">
        <div className="order-content-container">
          { item_photo ?
            <div className="order-content-container">
              <img className="order-photo" src={item_photo}/>
            </div> : null
          }
          { type_photo ?
            <div className="order-content-container">
              <img className="order-photo" src={type_photo}/>
            </div> : null
          }
          { item ? <p className="order-text">- {item}</p> : null }
          { type ? <p className="order-text">- {type}</p> : null }
          { size ? <p className="order-text">- {size}</p> : null }
        </div>
      </div>
      <div className="order-line"></div>
      <div className="row">
        <div className="order-content-container">
          <img className="order-photo" src={profile_pic}/>
        </div>
        <div className="order-content-container">
          <p className="order-text">Orderer: <strong>{customer_name}</strong></p>
          <p className="order-text">Pickup @: <strong>{pickuptime}</strong></p>
        </div>
      </div>
    </div>
  </div>
);

Order.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Order
