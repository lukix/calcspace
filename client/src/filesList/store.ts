import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import httpRequest from '../shared/httpRequest';

const actionTypes = {
  fetchFiles: createAsyncActionTypes('FETCH_FILES'),
};

export const actions = {
  fetchFiles: createAsyncActionCreator({
    actionTypes: actionTypes.fetchFiles,
    action: () => httpRequest.get('files'),
  }),
};

export const reducer = createReducer({
  initialState: {
    files: [],
    isFetchingFiles: false,
    fetchingFilesError: false,
  },
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.fetchFiles,
      payloadKey: 'files',
      pendingKey: 'isFetchingFiles',
      errorKey: 'fetchingFilesError',
    }),
  },
});

export const selectors = {
  files: state => state.filesList.files,
  isFetchingFiles: state => state.filesList.isFetchingFiles,
  fetchingFilesError: state => state.filesList.fetchingFilesError,
};
