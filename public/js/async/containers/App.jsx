import React, { Component, PropTypes } from 'react'
import Picker from '../components/Picker'
import OrdersBox from './OrdersBox'
import Footer from '../components/Footer'

const App = () => (
  <div>
    <OrdersBox/>
    <Footer/>
    {/*<Picker*/}
      {/*value={'placeholder value'}*/}
      {/*options={[ 'reactjs', 'frontend' ]}*/}
    {/*/>*/}
  </div>
);

export default App
