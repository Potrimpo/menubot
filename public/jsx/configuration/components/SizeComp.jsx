import React, { PropTypes, Component } from 'react'
import { debounce } from 'throttle-debounce';

class Size extends Component {

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
    const { changeSizeName, changeFurl, size, sizeid, furl, fbid } = this.props;

    return (
      <div className="row container-row">
        <div
          className="col-xs-12 size-container closed-borders top-smol-gap"
          ref={(container) => { this.container = container }}
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
              onClick={this.openEditor}
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
