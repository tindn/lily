import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import storage from 'redux-persist/es/storage';
import reducers from './reducers';

const persistConfig = {
  key: 'misc',
  storage,
  whitelist: ['electricityReadings'],
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
