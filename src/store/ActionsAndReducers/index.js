import { combineReducers } from 'redux';

import { reducer as entity } from './Entity';

const rootReducer = combineReducers({
  entity,
});

export default rootReducer;
