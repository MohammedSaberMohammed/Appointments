import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import _get from 'lodash/get';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions(
  {
    register: ['id'],

    get: ['id', 'data'],
    getSucceeded: ['id', 'data'],
    getFailed: ['id', 'error'],

    post: ['id', 'data'],
    postSucceeded: ['id', 'data'],
    postFailed: ['id', 'error'],

    put: ['id', 'data'],
    putSucceeded: ['id', 'data'],
    putFailed: ['id', 'data'],

    delete: ['id', 'data'],
    deleteSucceeded: ['id', 'data'],
    deleteFailed: ['id', 'error'],

    reset: ['id'],
    resetProp: ['id', 'prop'],
    resetResponseProps: ['id'],
  },
  {
    prefix: 'Entity/',
  },
);

export const EntityTypes = Types;
export const DefaultActionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE_SINGLE = Immutable({
  received: false,
  posted: false,
  updated: false,
  deleted: false,
  loading: false,
  error: null,
  data: {},
  // Store responses
  responseFromGet: null,
  responseFromPost: null,
  responseFromPut: null,
  responseFromDelete: null,
});

export const INITIAL_STATE = Immutable({
  byId: {},
});

/* ------------- Reducers ------------- */

const updateState = (state, id, updates) =>
  state.merge({
    byId: {
      ...state.byId,
      [id]: {
        ..._get(state, `byId.${id}`),
        ...updates,
      },
    },
  });

export const register = (state, { id }) =>
  updateState(state, id, INITIAL_STATE_SINGLE);

export const get = (state, { id }) =>
  updateState(state, id, {
    loading: true,
    error: null,
    responseFromGet: null,
  });

export const getSucceeded = (state, { id, data }) =>
  updateState(state, id, {
    loading: false,
    error: null,
    received: true,
    responseFromGet: data || INITIAL_STATE_SINGLE.responseFromGet,
  });

export const getFailed = (state, { id, error }) =>
  updateState(state, id, {
    loading: false,
    received: true,
    error,
  });

export const post = (state, { id }) =>
  updateState(state, id, {
    loading: true,
    error: null,
    responseFromPost: null,
  });

export const postSucceeded = (state, { id, data }) =>
  updateState(state, id, {
    loading: false,
    error: null,
    posted: true,
    responseFromPost: data || INITIAL_STATE_SINGLE.responseFromPost,
  });

export const postFailed = (state, { id, error }) =>
  updateState(state, id, {
    loading: false,
    posted: true,
    error: error || {},
  });

export const put = (state, { id }) =>
  updateState(state, id, {
    loading: true,
    error: null,
    responseFromUpdate: null,
  });

export const putSucceeded = (state, { id, data }) =>
  updateState(state, id, {
    loading: false,
    error: null,
    updated: true,
    responseFromUpdate: data || INITIAL_STATE_SINGLE.responseFromUpdate,
  });

export const putFailed = (state, { id, error }) =>
  updateState(state, id, {
    loading: false,
    updated: true,
    error: error || {},
  });

export const remove = (state, { id }) =>
  updateState(state, id, {
    loading: true,
    error: null,
    responseFromDelete: null,
  });

export const removeSucceeded = (state, { id, data }) =>
  updateState(state, id, {
    loading: false,
    error: null,
    deleted: true,
    responseFromDelete: data || INITIAL_STATE_SINGLE.responseFromDelete,
  });

export const removeFailed = (state, { id, error }) =>
  updateState(state, id, {
    loading: false,
    deleted: true,
    error,
  });

export const reset = (state, { id }) =>
  updateState(state, id, INITIAL_STATE_SINGLE);

export const resetProp = (state, { id, prop }) =>
  updateState(state, id, {
    [prop]: INITIAL_STATE_SINGLE[prop],
  });

export const resetResponseProps = (state, { id }) =>
  updateState(state, id, {
    posted: INITIAL_STATE_SINGLE.posted,
    received: INITIAL_STATE_SINGLE.received,
    updated: INITIAL_STATE_SINGLE.updated,
    deleted: INITIAL_STATE_SINGLE.deleted,
    error: INITIAL_STATE_SINGLE.error,
    responseFromGet: INITIAL_STATE_SINGLE.responseFromGet,
    responseFromPost: INITIAL_STATE_SINGLE.responseFromPost,
    responseFromUpdate: INITIAL_STATE_SINGLE.responseFromPut,
    responseFromRemove: INITIAL_STATE_SINGLE.responseFromDelete,
  });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REGISTER]: register,

  [Types.GET]: get,
  [Types.GET_SUCCEEDED]: getSucceeded,
  [Types.GET_FAILED]: getFailed,

  [Types.POST]: post,
  [Types.POST_SUCCEEDED]: postSucceeded,
  [Types.POST_FAILED]: postFailed,

  [Types.PUT]: put,
  [Types.PUT_SUCCEEDED]: putSucceeded,
  [Types.PUT_FAILED]: putFailed,

  [Types.DELETE]: remove,
  [Types.DELETE_SUCCEEDED]: removeSucceeded,
  [Types.DELETE_FAILED]: removeFailed,

  [Types.RESET]: reset,
  [Types.RESET_PROP]: resetProp,
  [Types.RESET_RESPONSE_PROPS]: resetResponseProps,
});
