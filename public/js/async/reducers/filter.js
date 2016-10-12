/**
 * Created by lewis.knoxstreader on 11/10/16.
 */
export const SHOW_ACTIVE = 'SHOW_ACTIVE';
export const SHOW_COMPLETED = 'SHOW_COMPLETED';

const visibilityFilter = (state = SHOW_ACTIVE, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state
  }
};

export default visibilityFilter
