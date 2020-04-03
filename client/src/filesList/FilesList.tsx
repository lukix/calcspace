import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { FaPlus } from 'react-icons/fa';
import styles from './FilesList.module.scss';

interface FilesListProps {
  items: Array<{ id: string; name: string }>;
  addFile: Function;
}

const FilesList: React.FC<FilesListProps> = ({ items, addFile }) => {
  const { pathname } = useLocation();

  return (
    <div className={styles.filesListPanel}>
      <div className={styles.actionIcons}>
        <FaPlus title="New File" onClick={() => addFile()} />
        {/* <FaTrash title="Delete File" /> */}
      </div>
      <ul className={styles.filesList}>
        {items.map(({ id, name }) => (
          <Link key={id} to={`/file/${id}`}>
            <li
              className={classNames({
                [styles.selected]: `/file/${id}` === pathname,
              })}
            >
              {name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default FilesList;
