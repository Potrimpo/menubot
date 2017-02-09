import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, filter } from 'ramda'

import SizeComp from '../components/SizeComp'
import { IS_SIZE, changeEntry, unfurl } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const key = ownProps.sizeid;

  const sizes = pluck('sizeid')(
    filter(
      (size) => key == size.sizeid,
      Object.values(state.sizes)
    )
  );

  const thisSize = {
    ...state.sizes[key],
    fbid: state.fbid
  };

  return thisSize
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSizeName: (event) => {
    console.log("picking up changes");
    dispatch(changeEntry({
      newValue: event.target.value,
      column: "size",
      entryType: IS_SIZE,
      id: ownProps.sizeid,
      fbid: ownProps.fbid
    }))
  },

  changeFurl: () => {
    dispatch(unfurl({
      id: ownProps.sizeid,
      entryType: IS_SIZE
    }))
  }
});


const SizeCont = connect(mapStateToProps, mapDispatchToProps)(SizeComp);

export default SizeCont
