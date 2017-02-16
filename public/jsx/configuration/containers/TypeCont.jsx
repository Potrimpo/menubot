import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, filter } from 'ramda'

import TypeComp from '../components/TypeComp'
import { IS_TYPE, changeEntry, unfurl, edit, endEdit } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const key = ownProps.typeid;

  const sizes = pluck('sizeid')(
    filter(
      (size) => key == size.typeid,
      Object.values(state.sizes)
    )
  );

  const displayPrice = state.types[key].type_price ? state.types[key].type_price : ""

  const thisType = {
    ...state.types[key],
    fbid: state.fbid,
    displayPrice,
    sizes };

  return thisType
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeTypeName: (event) => {
    dispatch(changeEntry({
      newValue:event.target.value,
      column: "type",
      entryType: IS_TYPE,
      id: ownProps.typeid,
      fbid: ownProps.fbid
    }))
  },

  changeTypePrice: (event) => {
    const value = event.target.value;
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value.replace(/\./g,'')) || value == '') {
      dispatch(changeEntry({
        newValue: value,
        column: "type_price",
        entryType: IS_TYPE,
        id: ownProps.typeid,
        fbid: ownProps.fbid
      }))
    }
  },

  changeFurl: () => {
    dispatch(unfurl({
      id: ownProps.typeid,
      entryType: IS_TYPE
    }))
  },

  openEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'block';
    dispatch(edit({
      id: ownProps.typeid,
      parentId: ownProps.itemid,
      grandparentId: "irrelevant",
      entryType: IS_TYPE
    }))
  },

  closeEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'none';

    dispatch(endEdit({
      id: ownProps.typeid,
      entryType: IS_TYPE
    }))
  }
});


const TypeCont = connect(mapStateToProps, mapDispatchToProps)(TypeComp);

export default TypeCont
