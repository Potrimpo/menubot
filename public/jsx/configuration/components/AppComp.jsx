import React, { Component, PropTypes } from 'react'
import Please from 'pleasejs'
import ItemComp from '../components/itemComp'
import NewItemComp from '../components/NewItemComp'
import fetch from 'node-fetch'


class App extends Component {
  componentDidMount() {
    const { fbid } = this.props;
    const data = fetch('/confdata', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    console.log('data from confdata: ', data);
  }
}


const App = ({items}) => {
  const dataPack = {
    color: Please.make_color({base_color: '#B9F6CA'}),
    border_color: Please.make_color({base_color: '#a9e0b8'}),
    types: []
  };

  return (
    <div style={{'padding': '5px'}} className="col-xs-12 col-md-8 col-md-offset-2">
      {items.map((item, i) =>
        <ItemComp
          {...item}
          {...dataPack}
        />
      )}
      <NewItemComp
        color={dataPack.color}
        border_color={dataPack.border_color}
      />
    </div>
  )
}


export default App
