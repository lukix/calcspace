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
  deleteFile: createAsyncActionTypes('DELETE_FILE'),
  renameFile: createAsyncActionTypes('RENAME_FILE'),
  DIRTY_FILE: 'DIRTY_FILE',
  MARK_SYNCING_START: 'MARK_SYNCING_START',
  MARK_SYNCING_SUCCESS: 'MARK_SYNCING_SUCCESS',
  MARK_SYNCING_FAILURE: 'MARK_SYNCING_FAILURE',
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
  deleteFile: createAsyncActionCreator({
    actionTypes: actionTypes.deleteFile,
    action: ({ id }) => httpRequest.delete(`files/${id}`),
    mapStartAction: (action, { id }) => ({ ...action, payload: { id } }),
    mapSuccessAction: (action, { id }) => ({ ...action, payload: { id } }),
    mapFailureAction: (action, { id }) => ({ ...action, payload: { id } }),
  }),
  renameFile: createAsyncActionCreator({
    actionTypes: actionTypes.renameFile,
    action: ({ id, oldName, newName }) =>
      httpRequest.put(`files/${id}/name`, { name: newName }),
    mapStartAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id, newName },
    }),
    mapSuccessAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id },
    }),
    mapFailureAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id, oldName },
    }),
  }),
  dirtyFile: ({ id }) => ({ type: actionTypes.DIRTY_FILE, payload: { id } }),
  markSyncingStart: ({ id }) => ({
    type: actionTypes.MARK_SYNCING_START,
    payload: { id },
  }),
  markSyncingSuccess: ({ id }) => ({
    type: actionTypes.MARK_SYNCING_SUCCESS,
    payload: { id },
  }),
  markSyncingFailure: ({ id }) => ({
    type: actionTypes.MARK_SYNCING_FAILURE,
    payload: { id },
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
        ...state.files,
        { id: TEMP_ID, name: 'Unnamed file', code: '', isCreating: true },
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

    [actionTypes.deleteFile.START]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isDeleting: true } : file
      ),
    }),
    [actionTypes.deleteFile.SUCCESS]: (state, { id }) => ({
      ...state,
      files: state.files.filter(file => file.id !== id),
    }),
    [actionTypes.deleteFile.FAILURE]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isDeleting: false } : file
      ),
    }),

    [actionTypes.renameFile.START]: (state, { id, newName }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, name: newName, isRenaming: true } : file
      ),
    }),
    [actionTypes.renameFile.SUCCESS]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isRenaming: false } : file
      ),
    }),
    [actionTypes.renameFile.FAILURE]: (state, { id, oldName }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, name: oldName, isRenaming: false } : file
      ),
    }),

    [actionTypes.DIRTY_FILE]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id
          ? { ...file, isModified: true, synchronizationError: false }
          : file
      ),
    }),
    [actionTypes.MARK_SYNCING_START]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isSynchronizing: true } : file
      ),
    }),
    [actionTypes.MARK_SYNCING_SUCCESS]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id
          ? {
              ...file,
              isModified: false,
              isSynchronizing: false,
              synchronizationError: false,
            }
          : file
      ),
    }),
    [actionTypes.MARK_SYNCING_FAILURE]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id
          ? { ...file, isSynchronizing: false, synchronizationError: true }
          : file
      ),
    }),
  },
});

export const selectors = {
  files: state =>
    state.filesList.files.sort((fileA, fileB) =>
      fileA.name.localeCompare(fileB.name)
    ),
  isFetchingFiles: state => state.filesList.isFetchingFiles,
  fetchingFilesError: state => state.filesList.fetchingFilesError,
  isCreatingFile: state =>
    state.filesList.files.some(({ isCreating }) => isCreating),
  isSynchronizingAnyFile: state =>
    state.filesList.files.some(
      ({ isCreating, isDeleting, isSynchronizing, isRenaming }) =>
        isCreating || isDeleting || isSynchronizing || isRenaming
    ),
  areThereAnyChangesToBeSaved: state =>
    state.filesList.files.some(
      ({ isModified, isSynchronizing, synchronizationError }) =>
        isModified && !isSynchronizing && !synchronizationError
    ),
  areThereAnySynchronizationErrors: state =>
    state.filesList.files.some(
      ({ synchronizationError }) => synchronizationError
    ),
};
