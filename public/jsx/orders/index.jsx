import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './containers/App'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [ thunk ];

const parseVariables = rootName =>
  rootName.match(/\w+/g);

const codeToObj = xs => ({
  fbid: xs[0],
  delay: xs[1]
});

const hydrate = () =>
  codeToObj(
    parseVariables(
      document.getElementById("root").getAttribute("name")
    ));

const store = createStore(
  reducer,
  hydrate(),
  composeEnhancers(applyMiddleware(...middleware))
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);