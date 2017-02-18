import { set, lensProp } from 'ramda'

import { ACT } from '../actions'


const company = (state = {}, action) => {
  switch (action.type) {

    case ACT.RECEIVE_COMPANY_INFO:
      const { name, location, bot_status, status, opentime, closetime, access_token } = action.company;
      return {
        name,
        location: location ? location : "",
        bot_status,
        status,
        opentime,
        closetime,
        access_token,
        editing: false
      }
      break;

    case ACT.EDIT_COMPANY:
      return set(
        lensProp('editing'),
        action.state,
        state
      )
      break;

    case ACT.CHANGE_COMPANY:
      return set(
        lensProp(action.property),
        action.newValue,
        state
      )
      break;

    case ACT.BOT_ACTIVATED:
      return set(
        lensProp('bot_status'),
        true,
        state
      )
      break;

    case ACT.BOT_DEACTIVATED:
      return set(
        lensProp('bot_status'),
        false,
        state
      )
      break;

    default:
      return state
  }
}

export default company
