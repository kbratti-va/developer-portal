import { createBrowserHistory, History } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { oAuthApiSelection } from './reducers/oAuthApiSelection';
import { apiVersioning } from './reducers/apiVersioning';
import { apiList } from './reducers/apiList';
import { RootState } from './types';

export const history: History = createBrowserHistory({
  basename: process.env.PUBLIC_URL ?? '/',
});

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const store = createStore(
  combineReducers<RootState>({
    apiList,
    apiVersioning,
    oAuthApiSelection,
  }),
  composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<RootState>)),
);

export default store;
