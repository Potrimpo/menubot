import React, { PropTypes } from 'react'

const NewSize = ({making, keyupHander}) => {
  if (making == false) {
    return (
      <div className="row container-row">
        <div
          className="col-xs-12 size-container closed-borders top-smol-gap"
        >
          <div className=" col-xs-12">
            <input
              type="text"
              className="entry-input"
              placeholder="Add a new size..."
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

export default NewSize
