import React, { PropTypes } from 'react'
import Please from 'pleasejs'

const NewItem = ({making, keyupHander}) => {
  if (making == false) {
    return (
      <div className="row item-coloring">
        <div
          className="col-xs-12 item-container closed-borders top-large-gap"
        >
          <div className="col-xs-12">
            <input
              type="text"
              className="entry-input"
              placeholder="Add a new item..."
              onKeyUp={keyupHander}
            >
            </input>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
};

export default NewItem
