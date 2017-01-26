import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT } from '../actions'

const changeDBItem = (action$, store) =>
   action$.ofType(ACT.CHANGE_ITEM)
    .debounceTime(1000)
    .switchMap(action =>
      ajax({
          method: "POST",
          url: `/test/${action.fbid}/nervecenter`,
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
          url: `/test/${action.fbid}/nervecenter`,
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
          url: `/test/${action.fbid}/nervecenter`,
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


const rootEpic = combineEpics(
  changeDBItem,
  changeDBType,
  changeDBSize
);

export default rootEpic
