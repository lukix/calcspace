import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import FileItem from './FileItem';
import { actions, selectors } from './store';
import styles from './FilesList.module.scss';

interface FilesListProps {
  addFile: Function;
  deleteFile: Function;

  files: Array<{ id: string; name: string }>;
  isFetchingFiles: boolean;
  fetchingFilesError: boolean;

  fetchFiles: Function;
}

const FilesList: React.FC<FilesListProps> = ({
  addFile,
  deleteFile,

  files,
  // isFetchingFiles,
  // fetchingFilesError,

  fetchFiles,
}) => {
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className={styles.filesListPanel}>
      <div className={styles.actionIcons}>
        <FaPlus title="New File" onClick={() => addFile()} />
      </div>
      <ul className={styles.filesList}>
        {files.map(({ id, name }) => (
          <FileItem
            key={id}
            id={id}
            name={name}
            deleteFile={deleteFile}
            isSynchronizing={false}
            isModified={false}
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
  }),
  {
    fetchFiles: actions.fetchFiles,
  }
)(FilesList);
