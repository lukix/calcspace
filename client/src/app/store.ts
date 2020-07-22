import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import { httpRequestWithoutRedirect } from '../shared/httpRequest';

const actionTypes = {
  fetchLoggedInUser: createAsyncActionTypes('FETCH_LOGGED_IN_USER'),
};

export const actions = {
  fetchLoggedInUser: createAsyncActionCreator({
    actionTypes: actionTypes.fetchLoggedInUser,
    action: () => httpRequestWithoutRedirect.get('users/logged-in'),
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
  },
});

export const selectors = {
  user: (state) => state.userData.user,
  isFetchingUser: (state) => state.userData.isFetchingUser,
  fetchingUserError: (state) => state.userData.fetchingUserError,
};
