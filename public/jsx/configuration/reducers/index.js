import { combineReducers } from 'redux'
import { merge, lensPath, set } from 'ramda'
import { ACT } from '../actions'

//A series of lenses on entry properties
const entryProperty = (index, property) => lensPath([index, property]);

const init = {};

const items = (state = init, action) => {
  switch (action.type) {
    case ACT.RECEIVE_MENU:
      return merge(state, action.items)
      break;

    case ACT.CHANGE_ITEM:
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )

    case ACT.UNFURL_ITEM:
      return set(
        entryProperty(action.id, 'furl'),
        !state[action.id].furl,
        state
      )

    default:
      return state
  }
}

const types = (state = init, action) => {
  switch (action.type) {
    case ACT.RECEIVE_MENU:
      return merge(state, action.types)
      break;

    case ACT.CHANGE_TYPE:
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )

    case ACT.UNFURL_TYPE:
      return set(
        entryProperty(action.id, 'furl'),
        !state[action.id].furl,
        state
      )

    default:
      return state
  }
}

const sizes = (state = init, action) => {
  switch (action.type) {
    case ACT.RECEIVE_MENU:
      return merge(state, action.sizes)
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

const rootReducer = combineReducers({
  fbid,
  saving,
  items,
  types,
  sizes
})

export default rootReducer
