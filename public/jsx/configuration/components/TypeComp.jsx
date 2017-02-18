import React, { PropTypes, Component } from 'react'

import SizeCont from '../containers/SizeCont'
import NewSizeCont from '../containers/NewSizeCont'

class Type extends Component {

  constructor (props) {
    super(props);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.typePageClick = this.typePageClick.bind(this);
  }

  mouseDownHandler () {
    this.mouseIsDownInEditor = true;
  }

  mouseUpHandler () {
      this.mouseIsDownInEditor = false;
  }

  typePageClick (event) {
    if (this.mouseIsDownInEditor) {
      return;
    }
    const { closeEditor } = this.props;
    window.removeEventListener('mousedown', this.typePageClick);
    closeEditor(event);
  }

  render () {
    const {
      changeTypeName, changeTypeDescription, changeTypePrice, changeFurl, deleteType,
      openEditor, closeEditor, editing,
      type, type_photo, type_description, displayDescription, type_price, displayPrice, typeid, furl, sizes, fbid, itemid
    } = this.props;

    if (editing) {
      window.addEventListener('mousedown', this.typePageClick, false);
      return (
        <div
          className="row container-row"
          onMouseDown={this.mouseDownHandler}
          onMouseUp={this.mouseUpHandler}
        >
          <div
            className="col-xs-12 type-container closed-borders top-med-gap editor-row"
          >
            <div className="col-xs-10">
              <input
                type="text"
                className="entry-input"
                placeholder="Rename this type..."
                value={type}
                onChange={changeTypeName}
              >
              </input>
            </div>
            <div className="col-xs-2">
              <button
                className="med-edit-button"
                type="button"
                onClick={(event) => {
                  window.removeEventListener('mousedown', this.typePageClick);
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
              <div style={type_photo ? {backgroundImage: `url(${type_photo})`} : null } className="entry-image"></div>
            </div>
            <div className="col-xs-12 col-sm-6" style={{padding: "5px"}}>
              <textarea
                rows="3"
                className="entry-input"
                placeholder="Add a description... (80 character limit)"
                value={displayDescription}
                onChange={changeTypeDescription}
              >
              </textarea>
              {
                sizes.length == 0 ?
                <div className="entry-price-container center-when-mobile">
                  <div>
                    <span>$</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Price..."
                    value={displayPrice}
                    onChange={changeTypePrice}
                  >
                  </input>
                </div> :
                null
              }
              <div
                className="entry-delete-button center-when-mobile"
                onClick={() => {
                  window.removeEventListener('mousedown', this.itemPageClick);
                  deleteType()
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
              <button
                className="med-edit-button"
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
        <div className="row container-row">
          <div
            className="col-xs-12 type-container top-open-borders top-med-gap"
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
              ></input>
            </div>
            <div className="col-xs-2">
              <button
                className="med-edit-button"
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

          <div className="col-xs-12 type-children-container">
            {sizes.map((size, i) =>
              <SizeCont
                key = {i}
                sizeid = {size}
                typeid = {typeid}
                itemid = {itemid}
                fbid = {fbid}
              />
            )}
            <NewSizeCont
              fbid = {fbid}
              parentId = {typeid}
              parentPrice = {type_price}
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
