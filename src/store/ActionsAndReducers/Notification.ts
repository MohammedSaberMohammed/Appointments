import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions(
  {
    notify: ['status', 'message'],
    resetProp: ['prop'],
  },
  {
    prefix: 'Notification/',
  },
);

export const NotificationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  active: false,
  status: 'success',
  message: null,
});

/* ------------- Reducers ------------- */

export const notify = (state, { message, status }) =>
  state.merge({ active: true, status, message });

export const resetProp = (state, { prop }) =>
  state.merge({ [prop]: INITIAL_STATE[prop] });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NOTIFY]: notify,
  [Types.RESET_PROP]: resetProp,
});
