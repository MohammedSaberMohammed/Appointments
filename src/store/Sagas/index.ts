import { all, takeEvery } from 'redux-saga/effects';

// ================ Redux Types ================
import { EntityTypes } from '../ActionsAndReducers/Entity';
import { LookupsTypes } from '../ActionsAndReducers/Lookups';

// ================ Saga Helpers ================
import entitySaga from './Entity';
import lookupsSagas from './Lookups';

export default function* rootSaga() {
  yield all([
    // =========== Entity  =============
    takeEvery(EntityTypes.GET, entitySaga.get),
    takeEvery(EntityTypes.POST, entitySaga.post),
    takeEvery(EntityTypes.PUT, entitySaga.put),
    takeEvery(EntityTypes.DELETE, entitySaga.delete),
    // Lookups
    takeEvery(LookupsTypes.GET, lookupsSagas.get),
  ]);
}
