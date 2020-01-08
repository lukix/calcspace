import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import httpRequest from '../shared/httpRequest';

const actionTypes = {
  addUser: createAsyncActionTypes('ADD_USER'),
  CLEAR_ADDED_USER: 'CLEAR_ADDED_USER',
};

export const actions = {
  addUser: createAsyncActionCreator({
    actionTypes: actionTypes.addUser,
    action: ({ username, password }) =>
      httpRequest.post('users', { username, password }),
  }),
  clearAddedUser: () => ({ type: actionTypes.CLEAR_ADDED_USER }),
};

export const reducer = createReducer({
  initialState: {
    addedUser: null,
    isAddingUser: false,
    addUserError: false,
  },
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.addUser,
      payloadKey: 'addedUser',
      pendingKey: 'isAddingUser',
      errorKey: 'addUserError',
    }),
    [actionTypes.CLEAR_ADDED_USER]: state => ({
      ...state,
      addedUser: null,
      addUserError: false,
    }),
    ...createAsyncActionHandlers({
      types: actionTypes.addUser,
      payloadKey: 'addedUser',
      pendingKey: 'isAddingUser',
      errorKey: 'addUserError',
    }),
  },
});

export const selectors = {
  addedUser: state => state.signInUpModal.addedUser,
  isAddingUser: state => state.signInUpModal.isAddingUser,
  addUserError: state => state.signInUpModal.addUserError,
};
