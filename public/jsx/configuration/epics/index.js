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

import itemEpics from './itemEpics'
import typeEpics from './typeEpics'
import sizeEpics from './sizeEpics'

const rootEpic = combineEpics(
  acquireMenu,
  ...itemEpics,
  ...typeEpics,
  ...sizeEpics
);

export default rootEpic
