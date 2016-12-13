export const SET_DELAY = 'SET_DELAY';

const delayTime = (state = "", action) => {
  console.log("action.time in reducers");
  console.log(action.time);
  switch (action.type) {
    case 'SET_DELAY':
      return {
        ...state,
        delayTime: action.time
      }
      break;
    default:
    return state;
  }
}

export default delayTime
