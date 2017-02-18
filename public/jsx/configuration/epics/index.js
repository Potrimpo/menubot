import { combineEpics } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import Rx from "rxjs/Rx";

import { ACT, initialStore } from '../actions'

const acquireCompanyInfo = ($action, store) =>
  $action.ofType(ACT.REQUEST_COMPANY_INFO)
    .switchMap(action =>
      ajax({
        method: 'GET',
        url: `${window.location.href}/nervecenter`,
        timeout: 3000,
      })
      .map(payload => {
        console.log("Returned code: " + payload.status);
        if (payload.status == 200) {
          console.log("Response to menu and company info request: ", payload.response);
          return initialStore(payload.response)
        } else {
          console.log("Request for menu and company info returned code ", payload.status);
          return {
            type: ACT.NOTIFY_REQUEST_COMPANY_INFO_FAILED
          }
        }
      })
    );

import itemEpics from './itemEpics'
import typeEpics from './typeEpics'
import sizeEpics from './sizeEpics'
import companyEpics from './companyEpics'

const rootEpic = combineEpics(
  acquireCompanyInfo,
  ...itemEpics,
  ...typeEpics,
  ...sizeEpics,
  ...companyEpics
);

export default rootEpic
