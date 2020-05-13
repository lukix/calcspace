import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import classNames from 'classnames';
import Spinner from '../shared/spinner';
import FileItem from './FileItem';
import { actions, selectors } from '../shared/filesStore';
import styles from './FilesList.module.scss';

interface FilesListProps {
  isFilesPanelVisible: boolean;
  files: Array<{
    id: string;
    name: string;
    isCreating?: boolean;
    isDeleting?: boolean;
    isRenaming?: boolean;
    isModified?: boolean;
    isSynchronizing?: boolean;
  }>;
  isFetchingFiles: boolean;
  fetchingFilesError: boolean;
  isCreatingFile: boolean;

  fetchFiles: Function;
  addFile: Function;
  deleteFile: Function;
  renameFile: Function;
}

const noop = () => {};

const FilesList: React.FC<FilesListProps> = ({
  isFilesPanelVisible,
  files,
  isFetchingFiles,
  fetchingFilesError,
  isCreatingFile,

  fetchFiles,
  addFile,
  deleteFile,
  renameFile,
}) => {
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  if (!isFilesPanelVisible) {
    return null;
  }

  const filesList = (
    <ul className={styles.filesList}>
      {files.map(
        ({ id, name, isModified, isCreating, isDeleting, isRenaming, isSynchronizing }) => (
          <FileItem
            key={id}
            id={id}
            name={name}
            deleteFile={deleteFile}
            renameFile={renameFile}
            isSynchronizing={isSynchronizing}
            isModified={isModified}
            isCreating={isCreating}
            isDeleting={isDeleting}
            isRenaming={isRenaming}
          />
        )
      )}
    </ul>
  );

  return (
    <div className={styles.filesListPanel}>
      <div
        className={classNames(styles.addFileButton, {
          [styles.addFileDisabled]: isCreatingFile,
        })}
        onClick={isCreatingFile ? noop : () => addFile()}
      >
        <FaPlus title="New File" />
        Add New File
      </div>
      <Spinner show={isFetchingFiles} centered>
        {fetchingFilesError && (
          <div className={styles.fetchErrorMessage}>Fetching files failed.</div>
        )}
        {filesList}
      </Spinner>
    </div>
  );
};

export default connect(
  (state) => ({
    isFilesPanelVisible: selectors.isFilesPanelVisible(state),
    files: selectors.files(state),
    isFetchingFiles: selectors.isFetchingFiles(state),
    fetchingFilesError: selectors.fetchingFilesError(state),
    isCreatingFile: selectors.isCreatingFile(state),
  }),
  {
    fetchFiles: actions.fetchFiles,
    addFile: actions.addFile,
    deleteFile: actions.deleteFile,
    renameFile: actions.renameFile,
  }
)(FilesList);
