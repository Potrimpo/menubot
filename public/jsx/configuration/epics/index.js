import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, IS_ITEM, IS_TYPE, IS_SIZE, initMenu, createdNewEntry } from '../actions'

const acquireMenu = ($action, store) =>
  $action.ofType(ACT.REQUEST_MENU)
    .switchMap(action =>
      ajax({
        method: 'GET',
        url: `${window.location.href}/nervecenter`,
        timeout: 3000
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          console.log("Response to menu request: ", payload.response);
          return initMenu(payload.response)
        } else {
          console.log("Request to change item returned code ", payload.status);
          return {
            type: ACT.NOTIFY_REQUEST_MENU_FAILED
          }
        }
      })
    );

const changeDBItem = (action$, store) =>
   action$.ofType(ACT.CHANGE_ITEM)
    .debounceTime(1000)
    .switchMap(action =>
      ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 1000,
          body: {
            request: ACT.CHANGE_ITEM,
            newValue: action.newValue,
            column: action.column,
            id: action.id,
            fbid: action.id
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.NOTIFY_SAVED
            }
          } else {
            throw "Request to change item returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
      );


const changeDBType = (action$, store) =>
   action$.ofType(ACT.CHANGE_TYPE)
    .debounceTime(1000)
    .switchMap(action =>
      ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 1000,
          body: {
            request: ACT.CHANGE_TYPE,
            newValue: action.newValue,
            column: action.column,
            id: action.id,
            fbid: action.id
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.NOTIFY_SAVED
            }
          } else {
            throw "Request to change type returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
      );

const changeDBSize = (action$, store) =>
   action$.ofType(ACT.CHANGE_SIZE)
    .debounceTime(1000)
    .switchMap(action =>
      ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 1000,
          body: {
            request: ACT.CHANGE_SIZE,
            newValue: action.newValue,
            column: action.column,
            id: action.id,
            fbid: action.id
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.NOTIFY_SAVED
            }
          } else {
            throw "Request to change size returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
      );

const newDBitem = (action$, store) =>
  action$.ofType(ACT.MAKING_ITEM)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 1000,
        body: {
          request: ACT.MAKING_ITEM,
          id: action.id,
          fbid: action.fbid,
          name: action.name
        }
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          console.log({...payload.response});
          return createdNewEntry({
            parentId: "irrelevant",
            newId: payload.response.newId,
            name: payload.response.name,
            price: payload.response.price,
            photo: payload.response.photo,
            entryType: IS_ITEM
          })
        } else {
          throw "Request to create new item returned code " + payload.status
          return {
            type: ACT.NOTIFY_CREATION_FAILED
          }
        }
      })
    );

const newDBtype = (action$, store) =>
  action$.ofType(ACT.MAKING_TYPE)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 1000,
        body: {
          request: ACT.MAKING_TYPE,
          id: action.id,
          fbid: action.fbid,
          name: action.name
        }
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          console.log({...payload.response});
          return createdNewEntry({
            parentId: payload.response.parentId,
            newId: payload.response.newId,
            name: payload.response.name,
            price: payload.response.price,
            photo: payload.response.photo,
            entryType: IS_TYPE
          })
        } else {
          throw "Request to create new item returned code " + payload.status
          return {
            type: ACT.NOTIFY_CREATION_FAILED
          }
        }
      })
      );

const newDBsize = (action$, store) =>
  action$.ofType(ACT.MAKING_SIZE)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 1000,
        body: {
          request: ACT.MAKING_SIZE,
          id: action.id,
          fbid: action.fbid,
          name: action.name
        }
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          console.log({...payload.response});
          return createdNewEntry({
            parentId: payload.response.parentId,
            newId: payload.response.newId,
            name: payload.response.name,
            price: payload.response.price,
            photo: payload.response.photo,
            entryType: IS_SIZE
          })
        } else {
          throw "Request to create new item returned code " + payload.status
          return {
            type: ACT.NOTIFY_CREATION_FAILED
          }
        }
      })
    );

const rootEpic = combineEpics(
  acquireMenu,
  changeDBItem,
  changeDBType,
  changeDBSize,
  newDBitem,
  newDBtype,
  newDBsize
);

export default rootEpic
