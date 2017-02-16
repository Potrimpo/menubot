import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, filter } from 'ramda'

import SizeComp from '../components/SizeComp'
import { IS_SIZE, changeEntry, unfurl, edit, endEdit } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const key = ownProps.sizeid;

  const sizes = pluck('sizeid')(
    filter(
      (size) => key == size.sizeid,
      Object.values(state.sizes)
    )
  );

  const displayPrice = state.sizes[key].size_price ? state.sizes[key].size_price : ""

  const thisSize = {
    ...state.sizes[key],
    fbid: state.fbid,
    displayPrice
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

  changeSizePrice: (event) => {
    const value = event.target.value;
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value.replace(/\./g,'')) || value == '') {
      dispatch(changeEntry({
        newValue: value,
        column: "size_price",
        entryType: IS_SIZE,
        id: ownProps.sizeid,
        fbid: ownProps.fbid
      }))
    }
  },

  openEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'block';
    dispatch(edit({
      id: ownProps.sizeid,
      parentId: ownProps.typeid,
      grandparentId: ownProps.itemid,
      entryType: IS_SIZE
    }))
  },

  closeEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'none';

    dispatch(endEdit({
      id: ownProps.sizeid,
      entryType: IS_SIZE
    }))
  }
});


const SizeCont = connect(mapStateToProps, mapDispatchToProps)(SizeComp);

export default SizeCont
