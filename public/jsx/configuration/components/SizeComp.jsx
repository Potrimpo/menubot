import React, { PropTypes, Component } from 'react'

class Size extends Component {

  constructor (props) {
    super(props);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.sizePageClick = this.sizePageClick.bind(this);
  }

  mouseDownHandler () {
    this.mouseIsDownInEditor = true;
  }

  mouseUpHandler () {
      this.mouseIsDownInEditor = false;
  }

  sizePageClick (event) {
    if (this.mouseIsDownInEditor) {
      return;
    }
    const { closeEditor } = this.props;
    window.removeEventListener('mousedown', this.sizePageClick);
    closeEditor(event);
  }

  render () {
    const {
      changeSizeName, changeSizePrice,
      openEditor, closeEditor, editing,
      size, displayPrice, sizeid, furl, fbid
    } = this.props;

    if (editing) {
      window.addEventListener('mousedown', this.sizePageClick, false);
      return (
        <div
          className="row container-row"
          onMouseDown={this.mouseDownHandler}
          onMouseUp={this.mouseUpHandler}
        >
          <div
            className="col-xs-12 size-container closed-borders top-smol-gap editor-row"
          >
            <div className="col-xs-10">
              <input
                type="text"
                className="entry-input"
                placeholder="Rename this size..."
                value={size}
                onChange={changeSizeName}
              >
              </input>
            </div>
            <div className="col-xs-2">
              <button
                className="smol-edit-button"
                type="button"
                onClick={(event) => {
                  window.removeEventListener('mousedown', this.sizePageClick);
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
            <div className="col-xs-12" style={{padding: "5px"}}>
              <textarea
                rows="3"
                className="entry-input"
                placeholder="Add a description... (80 character limit)"
              >
              </textarea>
              <div className="entry-price-container center-when-mobile">
                <div>
                  <span>$</span>
                </div>
                <input
                  type="text"
                  placeholder="Price..."
                  value={displayPrice}
                  onChange={changeSizePrice}
                >
                </input>
              </div>
              <div className="entry-delete-button center-when-mobile">
                Delete
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="row container-row">
        <div
          className="col-xs-12 size-container closed-borders top-smol-gap"
        >
          <div className="col-xs-10">
            <input
              type="text"
              className="entry-input"
              placeholder="Rename this size..."
              value={size}
              onChange={changeSizeName}
              onClick={(e) => e.stopPropagation()}
            >
            </input>
          </div>
          <div className="col-xs-2">
            <button
              className="smol-edit-button"
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
        </div>
      </div>
    )
  }
}

export default Size
