import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, receivePhotos } from '../actions'

const changeDBCompany = (action$, store) =>
   action$.ofType(ACT.CHANGE_COMPANY)
    .debounceTime(1000)
    .switchMap(action => {
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 10000,
          body: {
            request: ACT.CHANGE_COMPANY,
            newValue: action.newValue,
            property: action.property,
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
            throw "Request to change company returned code " + payload.status
            return {
              type: ACT.NOTIFY_SAVE_FAILED
            }
          }
        })
    });


const requestPhotos = (action$, store) =>
  action$.ofType(ACT.REQUEST_PHOTOS)
  .switchMap(action =>
    ajax ({
        method: "POST",
        url: `${window.location.href}/nervecenter`,
        timeout: 10000,
        body: {
          request: ACT.REQUEST_PHOTOS,
          fbid: action.fbid,
          access_token: action.access_token
        }
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          return receivePhotos(payload.response)
        } else {
          throw "Request to fetch photos returned code " + payload.status
          return {
            type: ACT.NOTIFY_PHOTOS_REQUEST_FAILED
          }
        }
      })
    );


const activateBot = (action$, store) =>
   action$.ofType(ACT.ACTIVATE_BOT)
    .debounceTime(1000)
    .switchMap(action => {
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 10000,
          body: {
            request: ACT.ACTIVATE_BOT,
            access_token: action.access_token,
            fbid: action.fbid
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.BOT_ACTIVATED
            }
          } else {
            throw "Request to activate company bot returned code " + payload.status
            return {
              type: ACT.NOTIFY_BOT_ACTIVATION_FAILED
            }
          }
        })
    });


const deactivateBot = (action$, store) =>
   action$.ofType(ACT.DEACTIVATE_BOT)
    .debounceTime(1000)
    .switchMap(action => {
      return ajax({
          method: "POST",
          url: `${window.location.href}/nervecenter`,
          timeout: 10000,
          body: {
            request: ACT.DEACTIVATE_BOT,
            access_token: action.access_token,
            fbid: action.fbid
          }
        })
        .map(payload => {
          console.log("Returned code: " + payload.status);
          if (payload.status == 200) {
            return {
              type: ACT.BOT_DEACTIVATED
            }
          } else {
            throw "Request to deactivate company bot returned code " + payload.status
            return {
              type: ACT.NOTIFY_BOT_DEACTIVATION_FAILED
            }
          }
        })
    });


export default [
  changeDBCompany,
  requestPhotos,
  activateBot,
  deactivateBot
]
