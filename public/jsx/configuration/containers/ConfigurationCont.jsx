import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { switchPageEditor, changeCompany, requestPhotos, switchBot } from '../actions'

import ConfigurationComp from '../components/ConfigurationComp'

const mapStateToProps = (state, ownProps) => ({
  ...state.company,
  saving: state.saving
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeEditor: () => {
    document.getElementById('spinner-overlay').style.display = 'none';
    dispatch(switchPageEditor(false));
  },

  requestPhotos: () => {
    dispatch(requestPhotos({
      fbid: ownProps.fbid,
      access_token: ownProps.access_token
    }))
  },

  activateBot: () => {
    dispatch(switchBot({
      access_token: ownProps.access_token,
      fbid: ownProps.fbid,
      newState: true
    }))
  },

  deactivateBot: () => {
    dispatch(switchBot({
      access_token: ownProps.access_token,
      fbid: ownProps.fbid,
      newState: false
    }))
  },

  changeLocation: (event) => {
    dispatch(changeCompany({
      property: 'location',
      newValue: event.target.value,
      fbid: ownProps.fbid
    }))
  },

  changeOpentime: (event) => {
    dispatch(changeCompany({
      property: 'opentime',
      newValue: event.target.value,
      fbid: ownProps.fbid
    }))
  },

  changeClosetime: (event) => {
    dispatch(changeCompany({
      property: 'closetime',
      newValue: event.target.value,
      fbid: ownProps.fbid
    }))
  },

  changeStatus: (event) => {
    dispatch(changeCompany({
      property: 'status',
      newValue: event.target.checked,
      fbid: ownProps.fbid
    }))
  }
})

const ConfigurationCont = connect(mapStateToProps, mapDispatchToProps)(ConfigurationComp);

export default ConfigurationCont
