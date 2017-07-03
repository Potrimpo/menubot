import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import NewItemComp from '../components/NewItemComp'
import { createNewEntry, IS_ITEM } from '../actions'


const mapStateToProps = (state, ownProps) => ({
  making: state.makingItem
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  keyupHander: (event) => {
    if (event.key == "Enter") {
      console.log("someone hit enter!");
      console.log("Here's the target's value: ", event.currentTarget.value);
      dispatch(
        createNewEntry({
          id: "irrelevant",
          fbid: ownProps.fbid,
          name: event.currentTarget.value,
          entryType: IS_ITEM
        })
      )
    }
  }
});


const NewItemCont = connect(mapStateToProps, mapDispatchToProps)(NewItemComp);

export default NewItemCont
