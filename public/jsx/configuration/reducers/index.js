import { combineReducers } from 'redux'
import { merge, lensPath, set, negate, compose } from 'ramda'
import { ACT } from '../actions'

const fbid = (state = "", action) => {
  switch (action.type) {
    default:
      return state
  }
}

const saving = (state = "", action) => {
  switch (action.type) {
    case ACT.NOTIFY_SAVED:
      return "Saved."
    case ACT.NOTIFY_SAVE_FAILED:
      return "Something went wrong there. We'll try again."
    case ACT.CHANGE_ITEM:
      return "Saving your changes now..."
    default:
      return state
  }
}

const makingInit = {
  item: false
}

const makingItem = (state = makingInit, action) => {
  switch (action.type) {

    case ACT.RECEIVE_MENU:
      return action.makingItem
      break;

    case ACT.MAKING_ITEM:
      return true
      break;

    case ACT.MADE_ITEM:
      return false
      break;

    default:
      return state
  }
}

import items from './itemsReducer'
import types from './typesReducer'
import sizes from './sizesReducer'


const rootReducer = combineReducers({
  fbid,
  saving,
  makingItem,
  items,
  types,
  sizes
})

export default rootReducer
