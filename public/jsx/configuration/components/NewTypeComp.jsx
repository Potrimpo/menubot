import React, { PropTypes } from 'react'

const NewType = ({making, keyupHander}) => {
  if (making == false) {
    return (
      <div className="row type-coloring container-row">
        <div
          className="col-xs-12 type-container closed-borders top-med-gap bot-med-gap"
        >
          <div className="col-xs-12">
            <input
              type="text"
              className="entry-input"
              placeholder="Add a new type..."
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

export default NewType
