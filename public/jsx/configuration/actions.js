import { addItemProps, addTypeProps, addSizeProps } from './miscFunctions'

//A list of action types
export const REQUEST_COMPANY_INFO = 'REQUEST_COMPANY_INFO';
export const NOTIFY_REQUEST_COMPANY_INFO_FAILED = 'NOTIFY_REQUEST_COMPANY_INFO_FAILED';
export const RECEIVE_COMPANY_INFO = 'RECEIVE_COMPANY_INFO';

export const REQUEST_PHOTOS = 'REQUEST_PHOTOS';
export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS';
export const NOTIFY_PHOTOS_REQUEST_FAILED = 'NOTIFY_PHOTOS_REQUEST_FAILED';

export const ACTIVATE_BOT = 'ACTIVATE_BOT';
export const BOT_ACTIVATED = 'BOT_ACTIVATED';
export const NOTIFY_BOT_ACTIVATION_FAILED = 'NOTIFY_BOT_ACTIVATION_FAILED';
export const DEACTIVATE_BOT = 'DEACTIVATE_BOT';
export const BOT_DEACTIVATED = 'BOT_DEACTIVATED';
export const NOTIFY_BOT_DEACTIVATION_FAILED = 'NOTIFY_BOT_DEACTIVATION_FAILED';


export const NOTIFY_SAVED = 'NOTIFY_SAVED';
export const NOTIFY_SAVE_FAILED = 'NOTIFY_SAVE_FAILED';

export const EDIT_COMPANY = 'EDIT_COMPANY';

export const CHANGE_COMPANY = 'CHANGE_COMPANY';
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
export const NOTIFY_CREATION_FAILED = 'NOTIFY_CREATION_FAILED';
export const MADE_ITEM = 'MADE_ITEM';
export const MADE_TYPE = 'MADE_TYPE';
export const MADE_SIZE = 'MADE_SIZE';

export const DELETING_ITEM = 'DELETING_ITEM';
export const DELETING_TYPE = 'DELETING_TYPE';
export const DELETING_SIZE = 'DELETING_SIZE';
export const NOTIFY_DELETED = 'NOTIFY_DELETED';
export const NOTIFY_DELETE_FAILED = 'NOTIFY_DELETE_FAILED';

export const INVALID_ACTION_CONSTRUCTION = 'INVALID_ACTION_CONSTRUCTION';

//Compilation of all action types for ease of importing on reducer and epic
//pages, where many if not all action types are needed
export const ACT = {
  REQUEST_COMPANY_INFO,
  NOTIFY_REQUEST_COMPANY_INFO_FAILED,
  RECEIVE_COMPANY_INFO,

  REQUEST_PHOTOS,
  NOTIFY_PHOTOS_REQUEST_FAILED,
  RECEIVE_PHOTOS,

  ACTIVATE_BOT,
  BOT_ACTIVATED,
  NOTIFY_BOT_ACTIVATION_FAILED,
  DEACTIVATE_BOT,
  BOT_DEACTIVATED,
  NOTIFY_BOT_DEACTIVATION_FAILED,

  NOTIFY_SAVED,
  NOTIFY_SAVE_FAILED,

  EDIT_COMPANY,

  CHANGE_COMPANY,
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
  NOTIFY_CREATION_FAILED,
  MADE_ITEM,
  MADE_TYPE,
  MADE_SIZE,

  DELETING_ITEM,
  DELETING_TYPE,
  DELETING_SIZE,
  NOTIFY_DELETED,
  NOTIFY_DELETE_FAILED,

  INVALID_ACTION_CONSTRUCTION
}

//A list of entry type declariations
export const IS_ITEM = 'IS_ITEM';
export const IS_TYPE = 'IS_TYPE';
export const IS_SIZE = 'IS_SIZE';

//Requests the company's menu and company info
//Expects:
// fbid: The fbid of the company's page
export const requestCompanyInfo = fbid => ({
  type: REQUEST_COMPANY_INFO,
  fbid
})
//Sends the menu and the company's info to the reducers to be turned into the
//store when AppCont first loads
export const initialStore = companyInfo => ({
  type: RECEIVE_COMPANY_INFO,

  items: addItemProps(companyInfo.items),
  types: addTypeProps(companyInfo.types),
  sizes: addSizeProps(companyInfo.sizes),
  company: companyInfo.company,
  makingItem: false
})


//Opens or closes the company editor
//Expects:
// state: True to open the editor, false to close the editor
export const switchPageEditor = (state) => ({ type: EDIT_COMPANY, state })


//Changes the value of a propery of the company in the database asynchronously,
//and in the storesynchronously
//Expects:
//  property: The property to change,
//  newValue: The new value of the property,
//  fbid: The fbid of the company's page
export const changeCompany = ({property, newValue, fbid}) => ({
  type: CHANGE_COMPANY,
  property,
  newValue,
  fbid
})


//Requests the server to deliver the item and type photos from Facebook
//Expects:
//  fbid: The fbid of the company's page
//  access_token: The access_token of the company's page
export const requestPhotos = ({fbid, access_token}) => ({
  type: REQUEST_PHOTOS,
  fbid,
  access_token
})
//Sends the result of photo requests to the reducers to update the store
export const receivePhotos = (updatedMenu) => ({
  type: RECEIVE_PHOTOS,

  items: addItemProps(updatedMenu.items),
  types: addTypeProps(updatedMenu.types)
})


//Requests for the company page's bot to be activated or deactivated depending
//on the new state requested.
//Expects:
//  fbid: The fbid of the company's page
//  access_token: The access_token of the company's page
export const switchBot = ({access_token, fbid, newState}) => {
  switch (newState) {

    case true:
      return {
        type: ACTIVATE_BOT,
        fbid,
        access_token
      }
      break;

    case false:
      return {
        type: DEACTIVATE_BOT,
        fbid,
        access_token
      }
      break;

    default:
      return {
        type: INVALID_ACTION_CONSTRUCTION
      }
  }
}


//Changes the value for an entry's property in the database asynchronously, and
//in the storesynchronously
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

export const createdNewEntry = ({ parentId, newId, name, description, price, photo, entryType }) => {
  switch (entryType) {

    case IS_ITEM:
      return {
        parentIndex: parentId,
        items: addItemProps(
          {
            [newId]: {
              itemid: newId,
              item: name,
              item_description: description,
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
              type_description: description,
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
              size_description: description,
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
