import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import httpRequest from '../shared/httpRequest';

const actionTypes = {
  fetchLoggedInUser: createAsyncActionTypes('FETCH_LOGGED_IN_USER'),
  SET_LOGGED_IN_USER: 'SET_LOGGED_IN_USER',
};

export const actions = {
  fetchLoggedInUser: createAsyncActionCreator({
    actionTypes: actionTypes.fetchLoggedInUser,
    action: () => httpRequest.get('users/logged-in'),
  }),
  setLoggedInUser: ({ username }) => ({
    type: actionTypes.SET_LOGGED_IN_USER,
    payload: { username },
  }),
};

export const reducer = createReducer({
  initialState: {
    user: null,
    isFetchingUser: false,
    fetchingUserError: false,
  },
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.fetchLoggedInUser,
      payloadKey: 'user',
      pendingKey: 'isFetchingUser',
      errorKey: 'fetchingUserError',
    }),
    [actionTypes.SET_LOGGED_IN_USER]: (state, { username }) => ({
      ...state,
      user: { username },
    }),
  },
});

export const selectors = {
  user: state => state.userData.user,
  isFetchingUser: state => state.userData.isFetchingUser,
  fetchingUserError: state => state.userData.fetchingUserError,
};
