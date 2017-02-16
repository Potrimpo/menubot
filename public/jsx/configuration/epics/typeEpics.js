import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, IS_TYPE, initMenu, createdNewEntry } from '../actions'

const changeDBType = (action$, store) =>
   action$.ofType(ACT.CHANGE_TYPE)
    .debounceTime(1000)
    .switchMap(action => {
      if (action.column == 'type_price' && action.newValue == "") {
        var newValue = 0;
      } else {
        var newValue = action.newValue;
      }
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 1000,
          body: {
            request: ACT.CHANGE_TYPE,
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
            throw "Request to change type returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
    });


const newDBtype = (action$, store) =>
  action$.ofType(ACT.MAKING_TYPE)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 10000,
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

export default [
  changeDBType,
  newDBtype
]
