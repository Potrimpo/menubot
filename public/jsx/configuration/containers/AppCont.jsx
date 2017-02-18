import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { keys } from 'ramda'

import AppComp from '../components/AppComp'
import { requestCompanyInfo } from '../actions.js'


const mapStateToProps = (state, ownProps) => {
  console.log("The state is now: ", state);
  const returnedState = {
    fbid: state.fbid,
    saving: state.saving,
    making: state.makingItem,
    items: keys(state.items)
  };
  return returnedState;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestCompanyInfo: (fbid) => {
    dispatch(
      requestCompanyInfo(fbid)
    )
  }
})

const AppCont = connect(mapStateToProps, mapDispatchToProps)(AppComp);

export default AppCont
