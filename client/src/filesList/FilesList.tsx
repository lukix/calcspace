import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './FilesList.module.scss';

interface FilesListProps {
  items: Array<{ id: string; name: string }>;
  addFile: Function;
}

const FilesList: React.FC<FilesListProps> = ({ items, addFile }) => {
  return (
    <div className={styles.filesListPanel}>
      <div className={styles.actionIcons}>
        <FaPlus title="New File" onClick={() => addFile()} />
        {/* <FaTrash title="Delete File" /> */}
      </div>
      <ul className={styles.filesList}>
        {items.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilesList;
