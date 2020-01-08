import { combineReducers } from 'redux';
import { reducer as signInUpModalReducer } from './signInUpModal/store';
import { reducer as userDataReducer } from './app/store';

const rootReducer = combineReducers({
  userData: userDataReducer,
  signInUpModal: signInUpModalReducer,
});

export default rootReducer;
