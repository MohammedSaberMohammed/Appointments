import api from '../../Services/Api';
import { call, put } from 'redux-saga/effects';
// Actions
import EntityActions from '../ActionsAndReducers/Entity';

export default {
  *get({ id, data }) {
    if (id === 'Time-Slots') {
      const res = yield call(api.timeslots, data);

      if (res.ok) {
        yield put(EntityActions.getSucceeded(id, res.data || {}));
      } else {
        yield put(EntityActions.getFailed(id, res.data || {}));
      }
    } else if (id === 'Appointments-reservation') {
      const res = yield call(api.availabilities, data);

      if (res.ok) {
        yield put(EntityActions.getSucceeded(id, res.data || {}));
      } else {
        yield put(EntityActions.getFailed(id, res.data || {}));
      }
    }
  },
  *post({ id, data }) {
    if (id === 'Appointments-reservation') {
      const res = yield call(api.appointments.save, data);
      if (res.ok) {
        yield put(EntityActions.postSucceeded(id, res.data));
      } else {
        yield put(EntityActions.postFailed(id, res.data || {}));
      }
    }
  },
};