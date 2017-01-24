import React, { PropTypes } from 'react'

const NewItem = ({color, border_color}) => (
  <div className="row">
    <div
      className="col-xs-12 item-container closed-borders top-large-gap"
      style{{'backgroundColor': color, 'borderColor': border_color}}
    >
      <div className="col-xs-12">
        <input type="text" className="entry-input" placeholder="Add a new item...">
      </div>
    </div>
  </div>
);

export default NewItem
