import { combineReducers } from 'redux'
import { insert, append } from 'ramda'
import { RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDER } from '../actions'
import filter from './filter'
import delay from './delay'
import { compareTimeAndUser, compareJustTime } from '../misc-functions'

const bongNoise = new Audio('/audio/bong.mp3');

const order = (state, action) => {
  switch (action.type) {
    case TOGGLE_ORDER:
      if (action.ids.includes(state.orderid)) {
        return {
          ...state,
          pending: !state.pending
        }
      } else {
        return state
      }

    default:
      return state
  }
};

const orders = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ORDERS:
      return [ ...action.orders ];
    case NEW_ORDER:
      bongNoise.play();
      return orderPlacement(state, action.order);
    case TOGGLE_ORDER:
      return state.map(o => order(o, action));
    default:
      return state
  }
};

const fbid = (state = "", action) => state;

const rootReducer = combineReducers({
  fbid,
  orders,
  filter,
  delay
});

export default rootReducer

function orderPlacement (state, newOrder) {
  //cloning state to newState variable
  for (let i = 0; i < state.length; i++) {
    if (compareTimeAndUser(newOrder, state[i])) {
      const newState = insert(i, newOrder, state);
      return newState;
    }
  }
  for (let j = 0; j < state.length; j++) {
    if (compareJustTime(newOrder, state[j])) {
      const newState = insert(j, newOrder, state)
      return newState;
    }
  }
  const newState = append(newOrder, state)
  return newState;
}
