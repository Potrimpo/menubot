import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, IS_ITEM, initMenu, createdNewEntry } from '../actions'

const changeDBItem = (action$, store) =>
   action$.ofType(ACT.CHANGE_ITEM)
    .debounceTime(1000)
    .switchMap(action => {
      if (action.column == 'item_price' && action.newValue == "") {
        var newValue = 0;
      } else {
        var newValue = action.newValue;
      }
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 1000,
          body: {
            request: ACT.CHANGE_ITEM,
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
            throw "Request to change item returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
    });

const newDBitem = (action$, store) =>
  action$.ofType(ACT.MAKING_ITEM)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 10000,
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


export default [
  changeDBItem,
  newDBitem
]
