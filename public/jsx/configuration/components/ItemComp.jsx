import React, { PropTypes, Component } from 'react'

import TypeCont from '../containers/TypeCont'
import NewTypeCont from '../containers/NewTypeCont'

class Item extends Component {

  constructor (props) {
    super(props);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.itemPageClick = this.itemPageClick.bind(this);
  }

  mouseDownHandler () {
    this.mouseIsDownInEditor = true;
  }

  mouseUpHandler () {
      this.mouseIsDownInEditor = false;
  }

  itemPageClick (event) {
    if (this.mouseIsDownInEditor) {
      return;
    }
    const { closeEditor } = this.props;
    window.removeEventListener('mousedown', this.itemPageClick);
    closeEditor(event);
  }

  render () {
    const {
      changeItemName, changeItemPrice, changeFurl, deleteItem,
      openEditor, closeEditor, editing,
      item, item_photo, item_price, displayPrice, itemid, furl, types, fbid
    } = this.props;

    if (editing) {
      window.addEventListener('mousedown', this.itemPageClick, false);
      return (
        <div
          className="row"
          onMouseDown={this.mouseDownHandler}
          onMouseUp={this.mouseUpHandler}
        >
          <div
            className="col-xs-12 item-container closed-borders top-large-gap editor-row"
          >
            <div className="col-xs-10">
              <input
                type="text"
                className="entry-input"
                placeholder="Rename this item..."
                value={item}
                onChange={changeItemName}
              >
              </input>
            </div>
            <div className="col-xs-2">
              <button
                className="large-edit-button"
                type="button"
                onClick={(event) => {
                  window.removeEventListener('mousedown', this.itemPageClick);
                  closeEditor(event)
                }}
              >
                <i
                  className="fa fa-pencil"
                  aria-hidden="true"
                >
                </i>
              </button>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div style={{paddingBottom: "52%"}}></div>
              <div style={item_photo ? {backgroundImage: `url(${item_photo})`} : null } className="entry-image"></div>
            </div>
            <div className="col-xs-12 col-sm-6" style={{padding: "5px"}}>
              {
                types.length == 0 ?
                <div className="entry-price-container center-when-mobile">
                  <div>
                    <span>$</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Price..."
                    value={displayPrice}
                    onChange={changeItemPrice}
                  >
                  </input>
                </div> :
                null
              }

              <div
                className="entry-delete-button center-when-mobile"
                onClick={() => {
                  window.removeEventListener('mousedown', this.itemPageClick);
                  deleteItem()
                }}
              >
                Delete
              </div>
            </div>
          </div>
        </div>
      )
    }

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
              <button
                className="large-edit-button"
                type="button"
                onClick={openEditor}
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
                onClick={openEditor}
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
                itemid = {itemid}
                fbid = {fbid}
              />
            )}
            <NewTypeCont
              fbid = {fbid}
              parentId = {itemid}
              parentPrice = {item_price}
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

// <textarea
//   rows="3"
//   className="entry-input"
//   placeholder="Add a description... (80 character limit)"
// >
// </textarea>

export default Item
