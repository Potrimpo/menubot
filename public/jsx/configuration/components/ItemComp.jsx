import React, { PropTypes, Component } from 'react'
import { debounce } from 'throttle-debounce';

import TypeCont from '../containers/TypeCont'


const Item = ({changeItemName, changeFurl, item, furl, types, fbid}) => {
  if (furl == false) {
    return (
      <div className="row">
        <div
          className="col-xs-12 item-container closed-borders top-large-gap"
          onClick={changeFurl}
        >
          <div className="col-xs-10">
            <input
              type="text"
              className="entry-input"
              placeholder="Rename this item..."
              value={item}
              onChange={changeItemName}
              onClick={(e) => e.stopPropagation()}
            >
            </input>
          </div>

          <div className="col-xs-2">
            <button className="large-edit-button" type="button">
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
          </div>
          <i className="fa fa-chevron-down entry-arrow" aria-hidden="true"></i>
        </div>
      </div>
    )
  } else {
    return (
      <div className="row">
        <div className="col-xs-12 item-container top-open-borders top-large-gap">
          <div className="col-xs-10">
            <input
              type="text"
              className="entry-input"
              placeholder="Rename this item..."
              value={item}
              onChange={changeItemName}
              onClick={(e) => e.stopPropagation()}
            >
            </input>
          </div>
          <div className="col-xs-2">
            <button className="large-edit-button" type="button">
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
          </div>
          <i className="fa fa-chevron-up entry-arrow" aria-hidden="true"></i>
        </div>

        <div className="col-xs-12 item-children-container">
          {types.map((type, i) =>
            <TypeCont
              key = {i}
              typeid = {type.typeid}
              fbid = {fbid}
            />
          )}
        </div>

        <div className="col-xs-12 item-container bottom-open-borders container-bottom"></div>
      </div>
    )
  }

}


export default Item
