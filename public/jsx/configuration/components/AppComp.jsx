import React, { Component, PropTypes } from 'react'

import ItemCont from '../containers/ItemCont'
import NewItemCont from '../containers/NewItemCont'
import HeaderCont from '../containers/HeaderCont'


class App extends Component {
  componentDidMount() {
    const { fbid, requestCompanyInfo } = this.props;
    requestCompanyInfo(fbid);
  }

  render () {
    const { items, saving, fbid } = this.props;

    return (
      <div style={{'padding': '5px'}} className="col-xs-12 col-md-8 col-md-offset-2">
        <HeaderCont/>
        <div className="row configuration-header-separator"></div>
        <div className="row">
          <p className="saved-text">{saving}</p>
        </div>
        {items.map((item, i) =>
          <ItemCont
            key = {i}
            itemid = {item}
            fbid = {fbid}
          />
        )}
        <NewItemCont
          fbid = {fbid}
        />
      </div>
    )
  }
};


export default App
