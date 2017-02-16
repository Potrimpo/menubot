import { addItemProps, addTypeProps, addSizeProps } from './miscFunctions'

//A list of action types
export const REQUEST_MENU  = 'REQUEST_MENU';
export const NOTIFY_REQUEST_MENU_FAILED  = 'NOTIFY_REQUEST_MENU_FAILED';
export const RECEIVE_MENU = 'RECEIVE_MENU';
export const NOTIFY_SAVED = 'NOTIFY_SAVED';
export const NOTIFY_SAVE_FAILED = 'NOTIFY_SAVE_FAILED';
export const CHANGE_ITEM = 'CHANGE_ITEM';
export const CHANGE_TYPE = 'CHANGE_TYPE';
export const CHANGE_SIZE = 'CHANGE_SIZE';
export const UNFURL_ITEM = 'UNFURL_ITEM';
export const UNFURL_TYPE = 'UNFURL_TYPE';
export const EDITING_ITEM = 'EDITING_ITEM';
export const EDITING_TYPE = 'EDITING_TYPE';
export const EDITING_SIZE = 'EDITING_SIZE';
export const UNEDITING_ITEM = 'UNEDITING_ITEM';
export const UNEDITING_TYPE = 'UNEDITING_TYPE';
export const UNEDITING_SIZE = 'UNEDITING_SIZE';
export const MAKING_ITEM = 'MAKING_ITEM';
export const MAKING_TYPE = 'MAKING_TYPE';
export const MAKING_SIZE = 'MAKING_SIZE';
export const DELETING_ITEM = 'DELETING_ITEM';
export const DELETING_TYPE = 'DELETING_TYPE';
export const DELETING_SIZE = 'DELETING_SIZE';
export const NOTIFY_DELETED = 'NOTIFY_DELETED';
export const NOTIFY_DELETE_FAILED = 'NOTIFY_DELETE_FAILED';
export const NOTIFY_CREATION_FAILED = 'NOTIFY_CREATION_FAILED';
export const MADE_ITEM = 'MADE_ITEM';
export const MADE_TYPE = 'MADE_TYPE';
export const MADE_SIZE = 'MADE_SIZE';

const INVALID_ACTION_CONSTRUCTION = 'INVALID_ACTION_CONSTRUCTION';

//Compilation of all action types for ease of importing on reducer and epic
//pages, where many if not all reducers are needed
export const ACT = {
  INVALID_ACTION_CONSTRUCTION,
  REQUEST_MENU,
  NOTIFY_REQUEST_MENU_FAILED,
  RECEIVE_MENU,
  NOTIFY_SAVED,
  NOTIFY_SAVE_FAILED,
  CHANGE_ITEM,
  CHANGE_TYPE,
  CHANGE_SIZE,
  UNFURL_ITEM,
  UNFURL_TYPE,
  EDITING_ITEM,
  EDITING_TYPE,
  EDITING_SIZE,
  UNEDITING_ITEM,
  UNEDITING_TYPE,
  UNEDITING_SIZE,
  MAKING_ITEM,
  MAKING_TYPE,
  MAKING_SIZE,
  DELETING_ITEM,
  DELETING_TYPE,
  DELETING_SIZE,
  NOTIFY_DELETED,
  NOTIFY_DELETE_FAILED,
  NOTIFY_CREATION_FAILED,
  MADE_ITEM,
  MADE_TYPE,
  MADE_SIZE
}

//A list of entry type declariations
export const IS_ITEM = 'IS_ITEM';
export const IS_TYPE = 'IS_TYPE';
export const IS_SIZE = 'IS_SIZE';

//Requests the menu
//Expects:
// fbid: The fbid of the company's page
export const requestMenu = fbid => {
  return {
    type: REQUEST_MENU,
    fbid
  }
}

//Sends the menu to the reducers to be turned into the store when AppCont
//first loads
export const initMenu = menu => {
  return {
    type: RECEIVE_MENU,
    items: addItemProps(menu.items),
    types: addTypeProps(menu.types),
    sizes: addSizeProps(menu.sizes),
    makingItem: false
  }
}


//Changes the value for an entry's property in the database
//Expects:
// newValue: The new value for the propery,
// column: The name of propery to change (itemid, item_photo, item_price, ect),
// entryType: The type of entry that is being changed (Item, type or size?),
// id: The ID of the entry (itemid, typeid, or sizeid),
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
// id: The ID of the entry (itemid, typeid, or sizeid),
// entryType: The type of entry that is being changed (Item or type?)
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


//Opens the editor for an item, type or size
//Expects:
// id: The ID of the entry (itemid, typeid, or sizeid),
// parentId: The ID of the entry's parent (itemid or typeid),
// grandparentId: The ID of the entry's parent's parent (itemid),
// entryType: The type of entry that is having it's editor opened (Item, type, or size?)
export const edit = ({ id, parentId, grandparentId, entryType }) => {
  switch (entryType) {
    case IS_ITEM:
      return {
        id,
        type: EDITING_ITEM
      }
      break;

    case IS_TYPE:
      return {
        id,
        parentId,
        type: EDITING_TYPE
      }
      break;

    case IS_SIZE:
      return {
        id,
        parentId,
        grandparentId,
        type: EDITING_SIZE
      }
      break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};


//Closes the editor for an item, type or size
//Expects:
// id: The ID of the entry (itemid, typeid, or sizeid)
// entryType: The type of entry that is having it's editor opened (Item, type, or size?)
export const endEdit = ({ id, entryType }) => {
  switch (entryType) {
    case IS_ITEM:
      return {
        id,
        type: UNEDITING_ITEM
      }
      break;

    case IS_TYPE:
      return {
        id,
        type: UNEDITING_TYPE
      }
      break;

    case IS_SIZE:
      return {
        id,
        type: UNEDITING_SIZE
      }
      break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};


//Adds an entry to the database, and then the state once the epic returns it
//Expects:
// id: The ID of the parent entry (itemid or typeid),
// name: The soon to be value of the db column item/type/size,
// fbid: The fbid of the company's page,
// parentPrice: The price of the parent entry (item_price, type_price),
// entryType: The type of entry that is being added (Item, type, or size?)

export const createNewEntry = ({ id, fbid, name, parentPrice, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        id: "irrelevant",
        fbid,
        name,
        type: MAKING_ITEM
      }
      break;

    case IS_TYPE:
      return {
        id,
        fbid,
        name,
        parentPrice,
        type: MAKING_TYPE
      }
      break;

    case IS_SIZE:
      return {
        id,
        fbid,
        name,
        parentPrice,
        type: MAKING_SIZE
      }
    break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};

export const createdNewEntry = ({ parentId, newId, name, price, photo, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        parentIndex: parentId,
        items: addItemProps(
          {
            [newId]: {
              itemid: newId,
              item: name,
              item_price: price,
              item_photo: photo
            }
          }
        ),
        type: MADE_ITEM
      }
      break;

    case IS_TYPE:
      return {
        parentIndex: parentId,
        types: addTypeProps(
          {
            [newId]: {
              itemid: parentId,
              typeid: newId,
              type: name,
              type_price: price,
              type_photo: photo
            }
          }
        ),
        type: MADE_TYPE
      }
      break;

    case IS_SIZE:
      return {
        parentIndex: parentId,
        sizes: addSizeProps(
          {
            [newId]: {
              typeid: parentId,
              sizeid: newId,
              size: name,
              size_price: price
            }
          }
        ),
        type: MADE_SIZE
      }
      break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
};


//Deletes an entry.
//Expects:
// id: The ID of the entry (itemid, typeid, or sizeid),
// entryType: The type of entry that is being added (Item, type, or size?)

export const deleteEntry = ({ id, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        id,
        type: DELETING_ITEM
      }
      break;

    case IS_TYPE:
      return {
        id,
        type: DELETING_TYPE
      }
      break;

    case IS_SIZE:
      return {
        id,
        type: DELETING_SIZE
      }
      break;

    default:

  }
}
