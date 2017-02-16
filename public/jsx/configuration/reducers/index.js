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
    case ACT.MAKING_ITEM:
    case ACT.MAKING_TYPE:
    case ACT.MAKING_SIZE:
      return "Creating now..."
    case ACT.MADE_ITEM:
    case ACT.MADE_TYPE:
    case ACT.MADE_SIZE:
      return "Creation successful."
    case ACT.NOTIFY_CREATION_FAILED:
      return "Creation failed. You may want to refresh the page."

    case ACT.CHANGE_ITEM:
    case ACT.CHANGE_TYPE:
    case ACT.CHANGE_SIZE:
      return "Saving your changes now..."
    case ACT.NOTIFY_SAVED:
      return "Saved."
    case ACT.NOTIFY_SAVE_FAILED:
      return "Something went wrong there. You may want to refresh the page."

    case ACT.DELETING_ITEM:
    case ACT.DELETING_TYPE:
    case ACT.DELETING_SIZE:
      return "Deleting now..."
    case ACT.NOTIFY_DELETED:
      return "Delete successful."
    case ACT.NOTIFY_DELETE_FAILED:
     return "Delete failed. You may want to refresh the page."

    case ACT.INVALID_ACTION_CONSTRUCTION:
      return "Something went wrong on our end. You may want to refresh the page."
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
