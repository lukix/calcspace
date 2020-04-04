import React from 'react';
import { FaPlus } from 'react-icons/fa';
import FileItem from './FileItem';
import styles from './FilesList.module.scss';

interface FilesListProps {
  items: Array<{ id: string; name: string }>;
  addFile: Function;
  deleteFile: Function;
}

const FilesList: React.FC<FilesListProps> = ({
  items,
  addFile,
  deleteFile,
}) => {
  return (
    <div className={styles.filesListPanel}>
      <div className={styles.actionIcons}>
        <FaPlus title="New File" onClick={() => addFile()} />
      </div>
      <ul className={styles.filesList}>
        {items.map(({ id, name }) => (
          <FileItem key={id} id={id} name={name} deleteFile={deleteFile} />
        ))}
      </ul>
    </div>
  );
};

export default FilesList;
