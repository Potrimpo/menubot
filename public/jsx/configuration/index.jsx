import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import AppCont from './containers/AppCont'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [ thunk ];

const init = {
  fbid: document.getElementById("root").getAttribute("name"),
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
