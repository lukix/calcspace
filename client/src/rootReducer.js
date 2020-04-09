import { combineReducers } from 'redux';
import { reducer as userDataReducer } from './app/store';
import { reducer as signInUpModalReducer } from './signInUpModal/store';
import { reducer as filesListReducer } from './shared/filesStore';

const rootReducer = combineReducers({
  userData: userDataReducer,
  signInUpModal: signInUpModalReducer,
  filesList: filesListReducer,
});

export default rootReducer;
