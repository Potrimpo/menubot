import React, { Component, PropTypes } from 'react'
import ItemComp from './ItemComp'
import NewItemComp from './NewItemComp'
import fetch from 'node-fetch'


class App extends Component {
  componentDidMount() {
    const { fbid } = this.props;
    const data = fetch('https://2fe4231b.ngrok.io/test/'+ fbid +'/confdata', {
      method: 'GET'
    })
      .then((rsp) =>  rsp.json())
      .then((body) => {
        console.log(body);
      })
      .catch((err) => {console.log(err)});
  }

  render () {
    return (
      <div style={{'padding': '5px'}} className="col-xs-12 col-md-8 col-md-offset-2">
        {this.props.items.map((item, i) =>
          <ItemComp
            {...item}
          />
        )}
        <NewItemComp />
      </div>
    )
  }
};


export default App
