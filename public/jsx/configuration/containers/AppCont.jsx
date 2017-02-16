import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { keys } from 'ramda'

import AppComp from '../components/AppComp'
import { requestMenu } from '../actions.js'


const mapStateToProps = (state, ownProps) => {
  console.log("The state is now: ", state);
  const returnedState = {
    fbid: state.fbid,
    saving: state.saving,
    editor: state.editor,
    making: state.makingItem,
    items: keys(state.items)
  };
  return returnedState;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestMenu: (fbid) => {
    dispatch(
      requestMenu(fbid)
    )
  }
})

const AppCont = connect(mapStateToProps, mapDispatchToProps)(AppComp);

export default AppCont
