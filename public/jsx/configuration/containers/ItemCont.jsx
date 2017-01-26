import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, equals, filter } from 'ramda'

import ItemComp from '../components/ItemComp'
import { IS_ITEM, changeEntry, unfurl } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const types = filter(
    (type) => equals(
      ownProps.itemid,
      type.itemid
    ),
    Object.values(state.types)
  )
  const key = ownProps.itemid;
  const thisItem = {
    ...state.items[key],
    fbid: state.fbid,
    types };
  return thisItem
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeItemName: (event) => {
    dispatch(changeEntry({
      newValue:event.target.value,
      column: "item",
      entryType: IS_ITEM,
      id: ownProps.itemid,
      fbid: ownProps.fbid
    }))
  },

  changeFurl: () => {
    dispatch(unfurl({
      id: ownProps.itemid,
      entryType: IS_ITEM
    }))
  }
});


const ItemCont = connect(mapStateToProps, mapDispatchToProps)(ItemComp);

export default ItemCont
