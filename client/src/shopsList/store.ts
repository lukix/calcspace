import httpRequest from '../shared/httpRequest';
import {
  createReducer,
  createAsyncActionCreator,
  createAsyncActionTypes,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';

const actionTypes = {
  fetchShops: createAsyncActionTypes('FETCH_SHOPS'),
};

const initialState = {
  shops: [],
  isFetchingShops: false,
  errorFetchingShops: false,
};

export default createReducer({
  initialState,
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.fetchShops,
      payloadKey: 'shops',
      pendingKey: 'isFetchingShops',
      errorKey: 'errorFetchingShops',
    }),
  },
});

export const selectors = {
  shops: state => state.shopsList.shops,
  isFetchingShops: state => state.shopsList.isFetchingShops,
  errorFetchingShops: state => state.shopsList.errorFetchingShops,
};

export const actions = {
  fetchShops: createAsyncActionCreator({
    actionTypes: actionTypes.fetchShops,
    action: () => httpRequest.get('shops'),
  }),
};
