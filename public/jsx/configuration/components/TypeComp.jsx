import React, { PropTypes, Component } from 'react'
import { debounce } from 'throttle-debounce';

const Type = ({changeTypeName, changeFurl, type, furl, sizeIds}) => {
  if (furl == false) {
    return (
      <div className="row container-row">
        <div
          className="col-xs-12 type-container closed-borders top-med-gap"
          onClick={changeFurl}
        >
          <div className="col-xs-10">
            <input
              type="text"
              className="entry-input"
              placeholder="Rename this type..."
              value={type}
              onChange={changeTypeName}
              onClick={(e) => e.stopPropagation()}
            >
            </input>
          </div>

          <div className="col-xs-2">
            <button className="med-edit-button" type="button">
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
          </div>
          <i className="fa fa-chevron-down entry-arrow" aria-hidden="true"></i>
        </div>
      </div>
    )
  } else {
    return (
      <div>FURLED</div>
    )
  }
}


export default Type
