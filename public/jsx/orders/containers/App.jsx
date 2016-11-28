import React, { Component, PropTypes } from 'react'
import OrdersBox from './OrdersBox'
import FilterTab from '../components/FilterTab'

const App = () => (
  <div>
    <FilterTab/>
    <OrdersBox/>
  </div>
);

export default App
