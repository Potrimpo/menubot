import { combineReducers } from 'redux'
import { merge, lensPath, set, negate, compose, dissoc } from 'ramda'
import { ACT } from '../actions'

import { entryProperty } from '../miscFunctions'

const init = {};

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

    case ACT.DELETING_TYPE:
      return dissoc(action.id.toString(), state)
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

    case ACT.EDITING_TYPE:
      return set(
        entryProperty(action.id, 'editing'),
        true,
        state
      )

    case ACT.EDITING_SIZE:
      return set(
        entryProperty(action.parentId, 'furl'),
        true,
        state
      )

    case ACT.UNEDITING_TYPE:
      return set(
        entryProperty(action.id, 'editing'),
        false,
        state
      )

    default:
      return state
  }
}

export default types
