import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import FileItem from './FileItem';
import { actions, selectors } from './store';
import styles from './FilesList.module.scss';

interface FilesListProps {
  files: Array<{
    id: string;
    name: string;
    isCreating?: boolean;
    isDeleting?: boolean;
  }>;
  isFetchingFiles: boolean;
  fetchingFilesError: boolean;
  isCreatingFile: boolean;

  fetchFiles: Function;
  addFile: Function;
  deleteFile: Function;
}

const FilesList: React.FC<FilesListProps> = ({
  files,
  // isFetchingFiles,
  // fetchingFilesError,
  isCreatingFile,

  fetchFiles,
  addFile,
  deleteFile,
}) => {
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className={styles.filesListPanel}>
      <div className={styles.actionIcons}>
        {!isCreatingFile && (
          <FaPlus title="New File" onClick={() => addFile()} />
        )}
      </div>
      <ul className={styles.filesList}>
        {files.map(({ id, name, isCreating, isDeleting }) => (
          <FileItem
            key={id}
            id={id}
            name={name}
            deleteFile={deleteFile}
            isSynchronizing={false}
            isModified={false}
            isCreating={isCreating}
            isDeleting={isDeleting}
          />
        ))}
      </ul>
    </div>
  );
};

export default connect(
  state => ({
    files: selectors.files(state),
    isFetchingFiles: selectors.isFetchingFiles(state),
    fetchingFilesError: selectors.fetchingFilesError(state),
    isCreatingFile: selectors.isCreatingFile(state),
  }),
  {
    fetchFiles: actions.fetchFiles,
    addFile: actions.addFile,
    deleteFile: actions.deleteFile,
  }
)(FilesList);
