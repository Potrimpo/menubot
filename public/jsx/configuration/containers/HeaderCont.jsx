import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { switchPageEditor } from '../actions'

import HeaderComp from '../components/HeaderComp'

const mapStateToProps = (state, ownProps) => ({
  companyName: state.company.name,
  editing: state.company.editing,
  access_token: state.company.access_token,
  fbid: state.fbid
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  openEditor: () => {
    document.getElementById('spinner-overlay').style.display = 'block';
    dispatch(switchPageEditor(true))
  }
})

const HeaderCont = connect(mapStateToProps, mapDispatchToProps)(HeaderComp);

export default HeaderCont
