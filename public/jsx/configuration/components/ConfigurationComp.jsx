import React, { Component, PropTypes } from 'react'

class ConfigurationComp extends Component {

  constructor (props) {
    super(props);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.pageClick = this.pageClick.bind(this);
  }

  mouseDownHandler () {
    this.mouseIsDownInEditor = true;
  }

  mouseUpHandler () {
      this.mouseIsDownInEditor = false;
  }

  pageClick (event) {
    if (this.mouseIsDownInEditor) {
      return;
    }
    const { closeEditor } = this.props;
    window.removeEventListener('mousedown', this.pageClick);
    closeEditor();
  }

  render () {

    const {
      closeEditor, changeLocation, changeOpentime, changeClosetime,
      changeStatus, requestPhotos, activateBot, deactivateBot,
      bot_status, location, opentime, closetime, status, saving
    } = this.props

    window.addEventListener('mousedown', this.pageClick, false);
    return (
      <div
        className="configuration-edit-container"
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}
      >
        <table>
          <tbody>

            <tr>
              <td><strong>Page configuration</strong></td>
              <td>
                <button
                  type="button"
                  className="large-edit-button"
                  onClick={closeEditor}
                >
                  <i className="fa fa-sliders" aria-hidden="true"></i>
                </button>
              </td>
            </tr>

            <tr><td></td><td></td></tr><tr><td></td><td></td></tr>

            <tr>
              <td>Location</td>
              <td>
                <input
                  type="text" role="button" autoComplete="off"
                  className="form-control"
                  placeholder="Location"
                  style={{cursor: 'text'}}
                  value={location}
                  onChange={changeLocation}
                >
                </input>
              </td>
            </tr>

            <tr><td></td><td></td></tr><tr><td></td><td></td></tr>

            <tr>
              <td>Opening hours</td>
              <td className="size-when-wide">
                <form id="timeSettingForm" className="form-inline">
                    <div className="col-xs-12" style={{padding: '0'}}>
                      <div className="input-group reactive-distr">
                        <span className="input-group-addon">Opening</span>
                        <input
                          type="time"
                          id="opentime"
                          name="openTime"
                          className="form-control time-setter"
                          value={opentime}
                          onChange={changeOpentime}
                        >
                        </input>
                      </div>
                      <div className="input-group">
                        <span className="input-group-addon">Closing</span>
                        <input
                          type="time"
                          id="closetime"
                          name="closeTime"
                          className="form-control time-setter"
                          value={closetime}
                          onChange={changeClosetime}
                        >
                        </input>
                      </div>
                    </div>
                    <div style={{clear: 'both'}}></div>

                    <div className="col-xs-12" style={{padding: '0', marginTop: "5px"}}>
                      <div className="configuration-week-day-selector text-center">
                        <input type="checkbox" id="weekday-mon" className="weekday" checked={status} onChange={changeStatus}>
                        </input>
                        <label style={{width: "100px"}} htmlFor="weekday-mon">
                          {
                            status ?
                            <span>Open</span> :
                            <span>Closed</span>
                          }
                        </label>

                      </div>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </form>
              </td>
            </tr>

            <tr><td></td><td></td></tr><tr><td></td><td></td></tr>

            <tr>
              <td>Photo control</td>
              <td>
                <button
                  type="button"
                  className="configuration-edit-button"
                  onClick={requestPhotos}
                >
                  Fetch photos from Facebook
                </button>
              </td>
            </tr>

            <tr><td></td><td></td></tr><tr><td></td><td></td></tr>

            <tr>
              <td>Activate bot</td>
              <td>
                {
                  bot_status ?
                  <button
                    type="button"
                    className="configuration-edit-button"
                    onClick={deactivateBot}
                  >
                    Deactivate bot
                  </button>
                  :
                  <button
                    type="button"
                    className="configuration-edit-button"
                    onClick={activateBot}
                  >
                    Activate bot
                  </button>
                }
              </td>
            </tr>

          </tbody>
        </table>
        <span className="saved-text">
          {saving}
        </span>
      </div>
    )
  }
}

// <input type="checkbox" id="weekday-tue" className="weekday" >
// </input>
// <label htmlFor="weekday-tue">Tue</label>
// <input type="checkbox" id="weekday-wed" className="weekday" >
// </input>
// <label htmlFor="weekday-wed">Wen</label>
// <input type="checkbox" id="weekday-thu" className="weekday" >
// </input>
// <label htmlFor="weekday-thu">Thu</label>
// <input type="checkbox" id="weekday-fri" className="weekday" >
// </input>
// <label htmlFor="weekday-fri">Fri</label>
// <input type="checkbox" id="weekday-sat" className="weekday" >
// </input>
// <label htmlFor="weekday-sat">Sat</label>
// <input type="checkbox" id="weekday-sun" className="weekday" >
// </input>
// <label htmlFor="weekday-sun">Sun</label>

export default ConfigurationComp
