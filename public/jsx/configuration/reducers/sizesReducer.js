import { combineReducers } from 'redux'
import { merge, lensPath, set, negate, compose } from 'ramda'
import { ACT } from '../actions'

import { entryProperty } from '../miscFunctions'

const init = {};

const sizes = (state = init, action) => {
  switch (action.type) {

    case ACT.RECEIVE_MENU:
      return merge(state, action.sizes)
      break;

    case ACT.MADE_SIZE:
      return merge(state, action.sizes)
      break;

    case ACT.CHANGE_SIZE:
      return set(
        entryProperty(action.id, action.column),
        action.newValue,
        state
      )
      break;

    case ACT.EDITING_SIZE:
      return set(
        entryProperty(action.id, 'editing'),
        true,
        state
      )

    case ACT.UNEDITING_SIZE:
      return set(
        entryProperty(action.id, 'editing'),
        false,
        state
      )

    default:
      return state
  }
}

export default sizes
