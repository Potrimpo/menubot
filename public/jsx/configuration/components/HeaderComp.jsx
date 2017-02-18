import React, { Component, PropTypes } from 'react'

import ConfigurationCont from '../containers/ConfigurationCont'

class HeaderComp extends Component {
  render () {
    const { companyName, editing, openEditor, fbid, access_token } = this.props;
    return (
      <div>
        <div className="row">
          <h1 className="text-center">{companyName}</h1>
        </div>
        <div className="row">
          <div className="text-center">
            <a href="/">
              <button
                type="button"
                className="header-button"
              >
                <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              </button>
            </a>

            <button
              type="button"
              className="header-button"
              onClick={openEditor}
            >
              <i className="fa fa-sliders" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        {
          editing ?
          <ConfigurationCont
            fbid={fbid}
            access_token={access_token}
          /> :
          null
        }
      </div>
    )
  }
}

export default HeaderComp
