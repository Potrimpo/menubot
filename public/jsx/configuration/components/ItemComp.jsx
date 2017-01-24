import React, { PropTypes } from 'react'

const Item = ({color, border_color, item, itemid, item_price, item_photo, types}) => {
  return (
  <div className="row">
    <div
      className="col-xs-12 item-container closed-borders top-large-gap"
      style={{'borderColor': border_color, 'backgroundColor':color}}
    >
      <div className="col-xs-10">
        <input type="text" className="entry-input" placeholder="Rename this item..." value={item}>
      </div>
      <div className="col-xs-2">
        <button className="large-edit-button" type="button">
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </button>
      </div>
      <i className="fa fa-chevron-down entry-arrow" aria-hidden="true"></i>
    </div>
  </div>
)};


export default Item
