import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import httpRequest from '../shared/httpRequest';

const actionTypes = {
  fetchFiles: createAsyncActionTypes('FETCH_FILES'),
  addFile: createAsyncActionTypes('ADD_FILE'),
};

export const actions = {
  fetchFiles: createAsyncActionCreator({
    actionTypes: actionTypes.fetchFiles,
    action: () => httpRequest.get('files'),
  }),
  addFile: createAsyncActionCreator({
    actionTypes: actionTypes.addFile,
    action: () => httpRequest.post('files'),
  }),
};

const TEMP_ID = 'TEMP_ID';

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
    [actionTypes.addFile.START]: state => ({
      ...state,
      files: [
        { id: TEMP_ID, name: 'Unnamed file', code: '', isCreating: true },
        ...state.files,
      ],
    }),
    [actionTypes.addFile.SUCCESS]: (state, payload) => ({
      ...state,
      files: state.files.map(file => (file.id === TEMP_ID ? payload : file)),
    }),
    [actionTypes.addFile.FAILURE]: state => ({
      ...state,
      files: state.files.filter(({ id }) => id !== TEMP_ID),
    }),
  },
});

export const selectors = {
  files: state => state.filesList.files,
  isFetchingFiles: state => state.filesList.isFetchingFiles,
  fetchingFilesError: state => state.filesList.fetchingFilesError,
  isCreatingFile: state =>
    state.filesList.files.some(({ isCreating }) => isCreating),
};
