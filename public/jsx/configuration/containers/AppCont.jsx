import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AppComp from '../components/AppComp'
import { initMenu } from '../actions.js'


const mapStateToProps = (state, ownProps) => {
  console.log("The state is now: ", state);
  const returnedState = {
    fbid: state.fbid,
    saving: state.saving,
    items: Object.values(state.items),
    types: Object.values(state.types)
  };
  return returnedState;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchMenu: (menuData) => {
    dispatch(
      initMenu(menuData)
    )
  },


})

const AppCont = connect(mapStateToProps, mapDispatchToProps)(AppComp);

export default AppCont
