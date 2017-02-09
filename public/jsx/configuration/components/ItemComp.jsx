import React, { PropTypes, Component } from 'react'

import TypeCont from '../containers/TypeCont'
import NewTypeCont from '../containers/NewTypeCont'

class Item extends Component {

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
    const {changeItemName, changeFurl, openEditor, item, itemid, furl, types, fbid} = this.props;

    if (furl == false) {
      return (
        <div className="row">
          <div
            className="col-xs-12 item-container closed-borders top-large-gap"
            onClick={changeFurl}
            ref={(container) => { this.container = container }}
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
              <button
                className="large-edit-button"
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
        <div className="row">
          <div
            className="col-xs-12 item-container top-open-borders top-large-gap"
            onClick={changeFurl}
            ref={(container) => { this.container = container }}
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
              <button
                className="large-edit-button"
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

          <div className="col-xs-12 item-children-container">
            {types.map((type, i) =>
              <TypeCont
                key = {i}
                typeid = {type}
                fbid = {fbid}
              />
            )}
            <NewTypeCont
              fbid = {fbid}
              parentId = {itemid}
            />
          </div>

          <div
            className="col-xs-12 item-container bottom-open-borders container-bottom"
            onClick={changeFurl}
          ></div>
        </div>
      )
    }
  }
};


export default Item
