import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './ActionsAndReducers';
import rootSaga from './Sagas';

const logger = createLogger({
  collapsed: true,
  duration: true,
  diff: true,
});

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat([logger, sagaMiddleware]),
});

sagaMiddleware.run(rootSaga);

export default store;
