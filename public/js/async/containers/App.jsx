import React, { Component, PropTypes } from 'react'
import Picker from '../components/Picker'
import OrdersBox from './OrdersBox'

const App = () => (
  <div>
    <OrdersBox/>
    <Picker
      value={'placeholder value'}
      options={[ 'reactjs', 'frontend' ]}
    />
  </div>
);

export default App
