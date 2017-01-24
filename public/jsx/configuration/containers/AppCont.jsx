import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AppComp from '../components/AppComp'
import { map } from 'ramda'

const returnItems = (entries) = {
  return entries
};

const mapStateToProps = state => return {
  items: Object.values(state.items)
};

const App = connect(mapStateToProps)(AppComp);

export default App
