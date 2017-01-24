import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AppComp from '../components/AppComp'
import { map } from 'ramda'

const mapStateToProps = state => {
  console.log(state);
  const returnedState = {
    fbid: state.fbid,
    items: Object.values(state.items)
  };
  console.log(returnedState);
  return returnedState;
}

const AppCont = connect(mapStateToProps)(AppComp);

export default AppCont
