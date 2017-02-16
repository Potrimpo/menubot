import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import NewTypeComp from '../components/NewTypeComp'
import { createNewEntry, IS_TYPE } from '../actions'


const mapStateToProps = (state, ownProps) => ({
  making: state.items[ownProps.parentId].makingNew
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
          entryType: IS_TYPE
        })
      )
    }
  }
});


const NewTypeCont = connect(mapStateToProps, mapDispatchToProps)(NewTypeComp);

export default NewTypeCont
