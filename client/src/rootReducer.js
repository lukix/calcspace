import { combineReducers } from 'redux';
import { reducer as userDataReducer } from './shared/userDataStore';
import { reducer as filesListReducer } from './shared/filesStore';

const rootReducer = combineReducers({
  userData: userDataReducer,
  filesList: filesListReducer,
});

export default rootReducer;
