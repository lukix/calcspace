import { combineReducers } from 'redux';
import shopsListReducer from './shopsList/store';

const rootReducer = combineReducers({
  shopsList: shopsListReducer,
});

export default rootReducer;
