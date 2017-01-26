import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'

import rootEpic from './epics'
import reducer from './reducers'
import AppCont from './containers/AppCont'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

const middleware = [ thunk, epicMiddleware ];

export const init = {
  fbid: document.getElementById("root").getAttribute("name"),
  saving: "Ready to save your changes",
  making: {
    item: false,
    type: false,
    size: false
  },
  items: {},
  types: {},
  sizes: {}
}

const store = createStore(
  reducer,
  init,
  composeEnhancers(applyMiddleware(...middleware))
);

render(
  <Provider store={store}>
    <AppCont />
  </Provider>,
  document.getElementById('root')
);
