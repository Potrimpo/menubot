import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, IS_SIZE, initMenu, createdNewEntry } from '../actions'

const changeDBSize = (action$, store) =>
   action$.ofType(ACT.CHANGE_SIZE)
    .debounceTime(1000)
    .switchMap(action => {
      if (action.column == 'size_price' && action.newValue == "") {
        var newValue = 0;
      } else {
        var newValue = action.newValue;
      }
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 10000,
          body: {
            request: ACT.CHANGE_SIZE,
            newValue,
            column: action.column,
            id: action.id,
            fbid: action.fbid
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
    });


const newDBsize = (action$, store) =>
  action$.ofType(ACT.MAKING_SIZE)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 10000,
        body: {
          request: ACT.MAKING_SIZE,
          id: action.id,
          fbid: action.fbid,
          name: action.name,
          parentPrice: action.parentPrice
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


const deleteDBSize = (action$, store) =>
   action$.ofType(ACT.DELETING_SIZE)
    .debounceTime(1000)
    .switchMap(action =>
      ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 10000,
          body: {
            request: ACT.DELETING_SIZE,
            id: action.id,
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.NOTIFY_DELETED
            }
          } else {
            throw "Request to delete size returned code " + payload.status
            return {
              type: ACT.NOTIFY_DELETE_FAILED
            }
          }
        })
    );


export default [
  changeDBSize,
  newDBsize,
  deleteDBSize
]
