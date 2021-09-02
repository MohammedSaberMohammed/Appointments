import { combineReducers } from 'redux';

import { reducer as entity } from './Entity';
import { reducer as lookups } from './Lookups';
import { reducer as notification } from './Notification';

const rootReducer = combineReducers({
  entity,
  lookups,
  notification,
});

export default rootReducer;
