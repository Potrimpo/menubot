import { combineReducers } from 'redux'
import { RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDER } from '../actions'
import filter from './filter'
import delay from './delay'

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
  const newState = state.slice(0);
  for (let i = 0; i < state.length; i++) {
    if (new Date(newOrder.pickuptime) < new Date(state[i].pickuptime)) {
      if (newOrder.customer_id == state[i].customer_id) {
        newState.splice(i, 0, newOrder);
        return newState;
      }
    }
  }
  newState.push(newOrder);
  return newState;
}
