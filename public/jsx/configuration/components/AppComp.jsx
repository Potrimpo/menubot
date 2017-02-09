import React, { Component, PropTypes } from 'react'
import fetch from 'node-fetch'
import ItemCont from '../containers/ItemCont'
import NewItemCont from '../containers/NewItemCont'


class App extends Component {
  componentDidMount() {
    const { fbid, requestMenu } = this.props;
    requestMenu(fbid)
  }

  render () {
    const { items, saving, fbid } = this.props;

    return (
      <div style={{'padding': '5px'}} className="col-xs-12 col-md-8 col-md-offset-2">
        <p>{saving}</p>
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
        <div className="editor-darkener"></div>
      </div>
    )
  }
};


export default App
