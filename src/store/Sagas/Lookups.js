import { put, call, select } from 'redux-saga/effects';
import LookupsActions from '../ActionsAndReducers/Lookups';
import api from '../../Services/Api';

const getLookup = (lookup) => (state) => state.lookups[lookup];

export default {
  *get({ lookup }) {
    const lookupState = yield select(getLookup(lookup));

    // don't load lookups twice
    if (lookupState && (lookupState.loaded || lookupState.loading)) {
      // Skipping loading lookup twice.
      return null;
    }

    yield put(LookupsActions.setLoading(lookup));

    const res = yield call(api.lookup, lookup);

    if (res.ok) {
      yield put(LookupsActions.getSuccess(lookup, res.data));
    } else {
      yield put(LookupsActions.getError(lookup, res.error));
    }
  },
};
