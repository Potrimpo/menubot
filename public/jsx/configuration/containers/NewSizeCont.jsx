import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import NewSizeComp from '../components/NewSizeComp'
import { createNewEntry, IS_SIZE } from '../actions'


const mapStateToProps = (state, ownProps) => ({
  making: state.types[ownProps.parentId].makingNew
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  keyupHander: (event) => {
    if (event.key == "Enter") {
      dispatch(
        createNewEntry({
          id: ownProps.parentId,
          fbid: ownProps.fbid,
          name: event.currentTarget.value,
          parentPrice: ownProps.parentPrice,
          entryType: IS_SIZE
        })
      )
    }
  }
});


const NewSizeCont = connect(mapStateToProps, mapDispatchToProps)(NewSizeComp);

export default NewSizeCont
