import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const { Types, Creators } = createActions(
  {
    get: ['lookup'],
    setLoading: ['lookup'],
    getSuccess: ['lookup', 'data'],
    getError: ['lookup', 'error'],
  },
  {
    prefix: 'lookups/',
  },
);

export const LookupsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({});

/* ------------- Reducers ------------- */
const setLoading = (state, { lookup }) =>
  state.merge({
    [lookup]: {
      ...state[lookup],
      loading: true,
    },
  });

const getSuccess = (state, { lookup, data }) =>
  state.merge({
    ...state.data,
    [lookup]: {
      loading: false,
      loaded: true,
      data,
    },
  });

const getError = (state, { lookup, error }) =>
  state.merge({
    ...state.data,
    [lookup]: {
      loading: false,
      error,
    },
  });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LOADING]: setLoading,
  [Types.GET_SUCCESS]: getSuccess,
  [Types.GET_ERROR]: getError,
});
