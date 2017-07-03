import { combineReducers } from 'redux'
import { merge, lensPath, set, negate, compose } from 'ramda'
import { ACT } from '../actions'

const fbid = (state = "", action) => {
  switch (action.type) {
    default:
      return state
  }
}

const saving = (state = "", action) => {
  switch (action.type) {
    case ACT.MAKING_ITEM:
    case ACT.MAKING_TYPE:
    case ACT.MAKING_SIZE:
      return "Creating now..."
    case ACT.MADE_ITEM:
    case ACT.MADE_TYPE:
    case ACT.MADE_SIZE:
      return "Creation successful."
    case ACT.NOTIFY_CREATION_FAILED:
      return "Creation failed. You may want to refresh the page."

    case ACT.CHANGE_ITEM:
    case ACT.CHANGE_TYPE:
    case ACT.CHANGE_SIZE:
    case ACT.CHANGE_COMPANY:
      return "Saving your changes now..."
    case ACT.NOTIFY_SAVED:
      return "Saved."
    case ACT.NOTIFY_SAVE_FAILED:
      return "Something went wrong there. You may want to refresh the page."

    case ACT.REQUEST_PHOTOS:
      return "Retrieving photos..."
    case ACT.RECEIVE_PHOTOS:
      return "Photos retrieved."
    case ACT.NOTIFY_PHOTOS_REQUEST_FAILED:
      return "Photo retrival failed. You may want to refresh the page."

    case ACT.ACTIVATE_BOT:
      return "Activating your bot..."
    case ACT.DEACTIVATE_BOT:
      return "Deactivating your bot..."
    case ACT.BOT_ACTIVATED:
      return "Bot activated."
    case ACT.BOT_DEACTIVATED:
      return "Bot deactivated."
    case ACT.NOTIFY_BOT_ACTIVATION_FAILED:
      return "Bot activation has failed. You may want to refresh your page."
    case ACT.NOTIFY_BOT_DEACTIVATION_FAILED:
      return "Bot deactivation has failed. You may want to refresh your page."


    case ACT.DELETING_ITEM:
    case ACT.DELETING_TYPE:
    case ACT.DELETING_SIZE:
      return "Deleting now..."
    case ACT.NOTIFY_DELETED:
      return "Delete successful."
    case ACT.NOTIFY_DELETE_FAILED:
     return "Delete failed. You may want to refresh the page."

    case ACT.INVALID_ACTION_CONSTRUCTION:
      return "Something went wrong on our end. You may want to refresh the page."
    default:
      return state
  }
}

const makingInit = {
  item: false
}

const makingItem = (state = makingInit, action) => {
  switch (action.type) {

    case ACT.RECEIVE_COMPANY_INFO:
      return action.makingItem
      break;

    case ACT.MAKING_ITEM:
      return true
      break;

    case ACT.MADE_ITEM:
      return false
      break;

    default:
      return state
  }
}


import items from './itemsReducer'
import types from './typesReducer'
import sizes from './sizesReducer'
import company from './companyReducer'


const rootReducer = combineReducers({
  fbid,
  saving,
  makingItem,
  company,
  items,
  types,
  sizes
})

export default rootReducer
