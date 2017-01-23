import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './components/App'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [ thunk ];

const init = {
  this: "this"
}

const store = createStore(
  reducer,
  init,
  composeEnhancers(applyMiddleware(...middleware))
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
