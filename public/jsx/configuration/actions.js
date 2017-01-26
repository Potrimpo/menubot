import { addFurl } from './miscFunctions'

//A list of action types
export const RECEIVE_MENU = 'RECEIVE_MENU';
export const NOTIFY_SAVED = 'NOTIFY_SAVED';
export const NOTIFY_SAVE_FAILED = 'NOTIFY_SAVE_FAILED';
export const CHANGE_ITEM = 'CHANGE_ITEM';
export const CHANGE_TYPE = 'CHANGE_TYPE';
export const CHANGE_SIZE = 'CHANGE_SIZE';
export const UNFURL_ITEM = 'UNFURL_ITEM';
export const UNFURL_TYPE = 'UNFURL_TYPE';
export const MAKING_ITEM = 'MAKING_ITEM';
export const MAKING_TYPE = 'MAKING_TYPE';
export const MAKING_SIZE = 'MAKING_SIZE';
export const MADE_ITEM = 'MADE_ITEM';
export const MADE_TYPE = 'MADE_TYPE';
export const MADE_SIZE = 'MADE_SIZE';

const INVALID_ACTION_CONSTRUCTION = 'INVALID_ACTION_CONSTRUCTION';

//Compilation of all action types for ease of importing on reducer and epic
//pages, where many if not all reducers are needed
export const ACT = {
  RECEIVE_MENU,
  NOTIFY_SAVED,
  NOTIFY_SAVE_FAILED,
  CHANGE_ITEM,
  CHANGE_TYPE,
  CHANGE_SIZE,
  UNFURL_ITEM,
  UNFURL_TYPE,
  MAKING_ITEM,
  MAKING_TYPE,
  MAKING_SIZE,
  MADE_ITEM,
  MADE_TYPE,
  MADE_SIZE
}

//A list of entry type declariations
export const IS_ITEM = 'IS_ITEM';
export const IS_TYPE = 'IS_TYPE';
export const IS_SIZE = 'IS_SIZE';


//Sends the menu to the reducers to be turned into the state when AppCont
//first loads
export const initMenu = menu => {
  return {
    type: RECEIVE_MENU,
    items: addFurl(menu.items),
    types: addFurl(menu.types),
    sizes: menu.sizes
  }
}


//Changes the value for an entry's property in the database
//Expects:
// newValue: The new value for the propery,
// column: The name of propery to change (itemid, item_photo, item_price, ect),
// entryType: The type of entry that is being changed (Item, type or size?),
// id: The ID of the entry (itemid, typeid, or sizeid)
// fbid: The fbid of the company's page
export const changeEntry = ({newValue, column, entryType, id, fbid}) => {
  switch (entryType) {
    case IS_ITEM:
      return {
        newValue,
        column,
        id,
        fbid,
        type: CHANGE_ITEM
      }
      break;

    case IS_TYPE:
      return {
        newValue,
        column,
        id,
        fbid,
        type: CHANGE_TYPE
      }
      break;

    case IS_SIZE:
      return {
        newValue,
        column,
        id,
        fbid,
        type: CHANGE_SIZE
      }
      break;
    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};

//Unfurls an item/type, revealing the types/sizes that are it's children
//Expects:
// id: The ID of the entry (itemid, typeid, or sizeid)
// entryType: The type of entry that is being changed (Item or type?),
export const unfurl = ({ id, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        id,
        type: UNFURL_ITEM
      }
      break;

    case IS_TYPE:
      return {
        id,
        type: UNFURL_TYPE
      }
      break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};

export const newEntry = ({ name, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        type: MAKING_ITEM
      }
      break;

    case IS_TYPE:
      return {
        type: MAKING_TYPE
      }
      break;

    case IS_SIZE:
      return {
        type: MAKING_SIZE
      }
    break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};
