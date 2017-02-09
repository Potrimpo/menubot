import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, filter } from 'ramda'

import TypeComp from '../components/TypeComp'
import { IS_TYPE, changeEntry, unfurl } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const key = ownProps.typeid;

  const sizes = pluck('sizeid')(
    filter(
      (size) => key == size.typeid,
      Object.values(state.sizes)
    )
  );

  const thisType = {
    ...state.types[key],
    fbid: state.fbid,
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

  changeFurl: () => {
    dispatch(unfurl({
      id: ownProps.typeid,
      entryType: IS_TYPE
    }))
  }
});


const TypeCont = connect(mapStateToProps, mapDispatchToProps)(TypeComp);

export default TypeCont