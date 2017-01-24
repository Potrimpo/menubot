import { combineReducers } from 'redux'
import { RECEIVE_MENU } from '../actions'

const items = (state, action) => {
  switch (action.type) {
    case RECEIVE_MENU:
      
      break;
    default:
      return state
  }
}

const rootReducer = (state, action) => state

export default rootReducer
