import React, { Component, PropTypes } from 'react'
import fetch from 'node-fetch'
import ItemCont from '../containers/ItemCont'
import NewItemComp from './NewItemComp'


class App extends Component {
  componentDidMount() {
    const { fbid, dispatchMenu } = this.props;
    const data = fetch(`https://48c63109.ngrok.io/test/${fbid}/nervecenter`, {
      method: 'GET'
    })
      .then((rsp) =>  rsp.json())
      .then((body) => {
        dispatchMenu(body)
      })
      .catch((err) => {console.log(err)});
  }

  render () {
    return (
      <div style={{'padding': '5px'}} className="col-xs-12 col-md-8 col-md-offset-2">
        <p>{this.props.saving}</p>
        {this.props.items.map((item, i) =>
          <ItemCont
            key = {i}
            itemid = {item.itemid}
            fbid = {this.props.fbid}
          />
        )}
        <NewItemComp />
      </div>
    )
  }
};


export default App
