import { combineReducers } from 'redux';
import { reducer as signInUpModalReducer } from './signInUpModal/store';

const rootReducer = combineReducers({
  signInUpModal: signInUpModalReducer,
});

export default rootReducer;
