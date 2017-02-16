import React, { PropTypes, Component } from 'react'

class Editor extends Component {
  render () {
    const { changeEntryName } = this.props;
    const { top, entryType, name } = this.props.editor;

    const containerClass = `col-xs-12 ${entryType}-container closed-borders editor-row`;
    const placeholder = `Rename this ${entryType}...`


    return (
      <div
        className={containerClass}
      >
        <div className="col-xs-10">
          <input
            type="text"
            className="entry-input"
            placeholder={placeholder}
            value={name}
            onChange={changeEntryName}
          >
          </input>
        </div>
        <div className="col-xs-2">
          <button className="large-edit-button" type="button">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </button>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div style={{paddingBottom: "52%"}}></div>
          <div className="entry-image"></div>
        </div>
        <div className="col-xs-12 col-sm-6" style={{padding: "5px"}}>
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
            <input type="text" placeholder="Price..."></input>
          </div>
          <div className="entry-delete-button center-when-mobile">
            Delete
          </div>
        </div>
      </div>
    )
  }
}

export default Editor
