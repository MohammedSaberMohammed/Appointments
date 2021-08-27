import { all, takeEvery } from 'redux-saga/effects';

// ================ Redux Types ================
import { EntityTypes } from '../ActionsAndReducers/Entity';

// ================ Saga Helpers ================
import entitySaga from './Entity';

export default function* rootSaga() {
  yield all([
    // =========== Entity  =============
    takeEvery(EntityTypes.GET, entitySaga.get),
    takeEvery(EntityTypes.POST, entitySaga.post),
  ]);
}
