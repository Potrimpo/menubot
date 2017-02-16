import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pluck, filter } from 'ramda'

import ItemComp from '../components/ItemComp'
import { IS_ITEM, changeEntry, unfurl, edit, endEdit, deleteEntry } from '../actions'


const mapStateToProps = (state, ownProps) => {
  const key = ownProps.itemid;

  const types = pluck('typeid')(
    filter(
      (type) => key == type.itemid,
      Object.values(state.types)
    )
  );

  const displayPrice = state.items[key].item_price ? state.items[key].item_price : ""

  const thisItem = {
    ...state.items[key],
    fbid: state.fbid,
    displayPrice,
    types };

  return thisItem
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeItemName: (event) => {
    dispatch(changeEntry({
      newValue: event.target.value ? event.target.value : "",
      column: "item",
      entryType: IS_ITEM,
      id: ownProps.itemid,
      fbid: ownProps.fbid
    }))
  },

  changeItemPrice: (event) => {
    const value = event.target.value;
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value.replace(/\./g,'')) || value == '') {
      dispatch(changeEntry({
        newValue: value,
        column: "item_price",
        entryType: IS_ITEM,
        id: ownProps.itemid,
        fbid: ownProps.fbid
      }))
    }
  },

  deleteItem: () => {
    document.getElementById('spinner-overlay').style.display = 'none';
    dispatch(deleteEntry({
      id: ownProps.itemid,
      entryType: IS_ITEM
    }))
  },

  changeFurl: () => {
    dispatch(unfurl({
      id: ownProps.itemid,
      entryType: IS_ITEM
    }))
  },

  openEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'block';

    dispatch(edit({
      id: ownProps.itemid,
      parentId: "irrelevant",
      grandparentId: "irrelevant",
      entryType: IS_ITEM
    }))
  },

  closeEditor: (event) => {
    event.stopPropagation()
    document.getElementById('spinner-overlay').style.display = 'none';

    dispatch(endEdit({
      id: ownProps.itemid,
      entryType: IS_ITEM
    }))
  }
});


const ItemCont = connect(
  mapStateToProps,
  mapDispatchToProps
  )(ItemComp);

export default ItemCont
