import React, { PropTypes, Component } from 'react'
import { debounce } from 'throttle-debounce';

import SizeCont from '../containers/SizeCont'
import NewSizeCont from '../containers/NewSizeCont'

class Type extends Component {

  constructor (props) {
    super(props);
    this.openEditor = this.openEditor.bind(this);
  }

  openEditor (event) {
    event.stopPropagation()
    var el = this.container;
    var yPos = 0;

    while (el) {
      if (el.tagName == "BODY") {
        var yScroll = el.scrollTop
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }

      el = el.offsetParent;
    }

    console.log("Container ref: ", this.container);
    console.log(`properties: width:${this.container.clientWidth}, height:${this.container.clientHeight}, top:${yPos}`);
  }

  render () {
    const { changeTypeName, changeFurl, type, typeid, furl, sizes, fbid } = this.props;

    if (furl == false) {
      return (
        <div className="row container-row">
          <div
            className="col-xs-12 type-container closed-borders top-med-gap"
            onClick={changeFurl}
            ref={(container) => { this.container = container }}
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
              <button
                className="med-edit-button"
                type="button"
                onClick={this.openEditor}
              >
                <i
                  className="fa fa-pencil"
                  aria-hidden="true"
                >
                </i>
              </button>
            </div>
            <i className="fa fa-chevron-down entry-arrow" aria-hidden="true"></i>
          </div>
        </div>
      )
    } else {
      return (
        <div className="row container-row">
          <div
            className="col-xs-12 type-container top-open-borders top-med-gap"
            onClick={changeFurl}
            ref={(container) => { this.container = container }}
          >
            <div className="col-xs-10">
              <input
                type="text"
                className="entry-input"
                placeholder="Rename this type..."
                value={type}
                onChange={changeTypeName}
                onClick={(e) => e.stopPropagation()}
              ></input>
            </div>
            <div className="col-xs-2">
              <button
                className="med-edit-button"
                type="button"
                onClick={this.openEditor}
              >
                <i
                  className="fa fa-pencil"
                  aria-hidden="true"
                >
                </i>
              </button>
            </div>
            <i className="fa fa-chevron-up entry-arrow" aria-hidden="true"></i>
          </div>

          <div className="col-xs-12 type-children-container">
            {sizes.map((size, i) =>
              <SizeCont
                key = {i}
                sizeid = {size}
                fbid = {fbid}
              />
            )}
            <NewSizeCont
              fbid = {fbid}
              parentId = {typeid}
            />
          </div>

          <div
            className="col-xs-12 type-container bottom-open-borders container-bottom"
            onClick={changeFurl}
          ></div>
        </div>
      )
    }
  }
}

export default Type
