import { getReducer, actions } from '../state';

const generateId = () => '99';

const commonTestState = {
  files: [
    {
      id: '1',
      name: 'file1',
      code: '123',
    },
  ],
};

describe('state reducer', () => {
  it('should add a file', () => {
    // given
    const prevState = commonTestState;
    const addFileAction = actions.addFile();

    // when
    const newState = getReducer(generateId)(prevState, addFileAction);

    // then
    expect(newState.files.length).toEqual(2);
  });

  it('should delete a file', () => {
    // given
    const prevState = commonTestState;

    const fileId = '1';
    const deleteFileAction = actions.deleteFile({ id: fileId });

    // when
    const newState = getReducer(generateId)(prevState, deleteFileAction);

    // then
    expect(newState.files.length).toEqual(0);
  });

  it('should update code', () => {
    // given
    const prevState = commonTestState;

    const fileId = '1';
    const newValue = '5';

    const updateAction = actions.updateCode({ id: fileId, code: newValue });

    // when
    const newState = getReducer(generateId)(prevState, updateAction);

    // then
    expect(newState).toEqual({
      files: [
        {
          id: '1',
          name: 'file1',
          code: '5',
        },
      ],
    });
  });
});
