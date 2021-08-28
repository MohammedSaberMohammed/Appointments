import { combineReducers } from 'redux';

import { reducer as entity } from './Entity';
import { reducer as lookups } from './Lookups';

const rootReducer = combineReducers({
  entity,
  lookups,
});

export default rootReducer;
