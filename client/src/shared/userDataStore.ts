import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from './reduxHelpers';
import { httpRequestWithoutRedirect } from './httpRequest';
import { clearTokens, getRefreshToken } from './authTokens';

const actionTypes = {
  fetchLoggedInUser: createAsyncActionTypes('FETCH_LOGGED_IN_USER'),
  logOut: createAsyncActionTypes('LOG_OUT'),
};

export const actions = {
  fetchLoggedInUser: createAsyncActionCreator({
    actionTypes: actionTypes.fetchLoggedInUser,
    action: () => httpRequestWithoutRedirect.get('users/logged-in'),
  }),
  logOut: createAsyncActionCreator({
    actionTypes: actionTypes.logOut,
    action: async () => {
      const refreshToken = getRefreshToken();
      await httpRequestWithoutRedirect.post('users/sign-out', { refreshToken });
      clearTokens();
    },
  }),
};

export const reducer = createReducer({
  initialState: {
    user: null,
    isFetchingUser: false,
    fetchingUserError: false,
    isLoggingOut: false,
  },
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.fetchLoggedInUser,
      payloadKey: 'user',
      pendingKey: 'isFetchingUser',
      errorKey: 'fetchingUserError',
    }),
    [actionTypes.logOut.START]: (state) => ({
      ...state,
      isLoggingOut: true,
    }),
    [actionTypes.logOut.SUCCESS]: (state) => ({
      ...state,
      isLoggingOut: false,
      user: null,
    }),
    [actionTypes.logOut.FAILURE]: (state) => ({
      ...state,
      isLoggingOut: false,
    }),
  },
});

export const selectors = {
  user: (state) => state.userData.user,
  isFetchingUser: (state) => state.userData.isFetchingUser,
  fetchingUserError: (state) => state.userData.fetchingUserError,
  isLoggingOut: (state) => state.userData.isLoggingOut,
};
