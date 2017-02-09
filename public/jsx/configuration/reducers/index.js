import { combineReducers } from 'redux'
import { merge, lensPath, set, negate, compose } from 'ramda'
import { ACT } from '../actions'

//A series of lenses on entry properties
const entryProperty = (index, property) => lensPath([index, property]);

const init = {};

const items = (state = init, action) => {
  switch (action.type) {

    case ACT.RECEIVE_MENU:
      return merge(state, action.items)
      break;

    case ACT.MAKING_TYPE:
      return set(
        entryProperty(action.id, 'makingNew'),
        true,
        state
      )
      break;

    case ACT.MADE_ITEM:
      return merge(state, action.items)
      break;

    case ACT.MADE_TYPE:
      return set(
        entryProperty(action.parentIndex, 'makingNew'),
        false,
        state
      )
      break;

    case ACT.CHANGE_ITEM:
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )
      break;

    case ACT.UNFURL_ITEM:
      return set(
        entryProperty(action.id, 'furl'),
        !state[action.id].furl,
        state
      )
      break;

    default:
      return state
  }
}

const types = (state = init, action) => {
  switch (action.type) {

    case ACT.RECEIVE_MENU:
      return merge(state, action.types)
      break;

    case ACT.MAKING_SIZE:
      return set(
        entryProperty(action.id, 'makingNew'),
        true,
        state
      )
      break;

    case ACT.MADE_TYPE:
      return merge(state, action.types)
      break;

    case ACT.MADE_SIZE:
      return set(
        entryProperty(action.parentIndex, 'makingNew'),
        false,
        state
      )
      break;

    case ACT.CHANGE_TYPE:
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )
      break;

    case ACT.UNFURL_TYPE:
      return set(
        entryProperty(action.id, 'furl'),
        !state[action.id].furl,
        state
      )
      break;

    default:
      return state
  }
}

const sizes = (state = init, action) => {
  switch (action.type) {

    case ACT.RECEIVE_MENU:
      return merge(state, action.sizes)
      break;

    case ACT.MADE_SIZE:
      return merge(state, action.sizes)
      break;

    case ACT.CHANGE_SIZE:
      console.log("Chanign size now");
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )
      break;

    default:
      return state
  }
}

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

const editor = (state = false, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const makingInit = {
  item: false,
  type: {},
  size: {}
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

const rootReducer = combineReducers({
  fbid,
  saving,
  editor,
  makingItem,
  items,
  types,
  sizes
})

export default rootReducer
