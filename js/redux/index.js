import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

const persistConfig = {
  key: 'lily-app',
  storage,
  whitelist: ['accounts', 'categories', 'vendors', 'tesla'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
// eslint-disable-next-line no-underscore-dangle
// eslint-disable-next-line no-undef
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export const persistor = persistStore(store);
