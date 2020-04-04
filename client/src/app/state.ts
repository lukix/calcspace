import { createReducer } from '../shared/reduxHelpers';

const ACTION_TYPES = {
  UPDATE_CODE: 'UPDATE_CODE',
  ADD_FILE: 'ADD_FILE',
  DELETE_FILE: 'DELETE_FILE',
};

const createEmptyFile = generateId => ({
  id: generateId(),
  code: '',
  name: new Date().toISOString(),
});

export const getInitialState = generateId => ({
  files: [createEmptyFile(generateId)],
});

const setFileCode = (state, fileId, value) => ({
  ...state,
  files: state.files.map(file =>
    file.id === fileId ? { ...file, code: value } : file
  ),
});

export const getReducer = generateId =>
  createReducer({
    actionHandlers: {
      [ACTION_TYPES.UPDATE_CODE]: (state, { newValue, fileId }) =>
        setFileCode(state, fileId, newValue),
      [ACTION_TYPES.ADD_FILE]: state => ({
        ...state,
        files: [createEmptyFile(generateId), ...state.files],
      }),
      [ACTION_TYPES.DELETE_FILE]: (state, { fileId }) => ({
        ...state,
        files: state.files.filter(file => file.id !== fileId),
      }),
    },
  });

export const actions = {
  addFile: () => ({ type: ACTION_TYPES.ADD_FILE }),
  updateCode: ({ code, id }) => ({
    type: ACTION_TYPES.UPDATE_CODE,
    payload: { newValue: code, fileId: id },
  }),
  deleteFile: ({ id }) => ({
    type: ACTION_TYPES.DELETE_FILE,
    payload: { fileId: id },
  }),
};
