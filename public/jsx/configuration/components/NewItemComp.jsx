import React, { PropTypes } from 'react'
import Please from 'pleasejs'

const NewItem = () => {
  return (
    <div className="row">
      <div
        className="col-xs-12 item-container closed-borders top-large-gap"
      >
        <div className="col-xs-12">
          <input
            type="text"
            className="entry-input"
            placeholder="Add a new item...">
          </input>
        </div>
      </div>
    </div>
  )
};

export default NewItem
