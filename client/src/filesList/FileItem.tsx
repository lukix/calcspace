import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { FaTrash } from 'react-icons/fa';
import styles from './FilesList.module.scss';

interface FileItemProps {
  id: string;
  name: string;
  deleteFile: Function;
}

const FileItem: React.FC<FileItemProps> = ({ id, name, deleteFile }) => {
  const { pathname } = useLocation();
  const path = `/file/${id}`;

  return (
    <li
      className={classNames({
        [styles.selected]: path === pathname,
      })}
    >
      <Link to={path}>
        <div>{name}</div>
      </Link>
      <div className={styles.fileActionIcons}>
        <FaTrash title="Delete File" onClick={() => deleteFile({ id })} />
      </div>
    </li>
  );
};

export default FileItem;
