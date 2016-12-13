export const SET_DELAY = 'SET_DELAY';

const delayTime = (state = 5, action) => {
  switch (action.type) {
    case 'SET_DELAY':
      return Number(action.time);
    default:
      return state;
  }
};

export default delayTime
