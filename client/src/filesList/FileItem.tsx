import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import {
  FaTrash,
  FaRegCircle,
  FaRegDotCircle,
  FaHourglassEnd,
} from 'react-icons/fa';
import styles from './FilesList.module.scss';

interface StatusIconProps {
  isSynchronizing: boolean;
  isModified: boolean;
  size: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  isSynchronizing,
  isModified,
  size,
}) => {
  if (isSynchronizing) {
    return <FaHourglassEnd size={size} title="Synchronizing..." />;
  }
  if (isModified) {
    return <FaRegDotCircle size={size} title="Unsaved changes" />;
  }
  return <FaRegCircle size={size} title="Synchronized" />;
};

interface FileItemProps {
  id: string;
  name: string;
  deleteFile: Function;
  isSynchronizing: boolean;
  isModified: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  id,
  name,
  deleteFile,
  isSynchronizing,
  isModified,
}) => {
  const { pathname } = useLocation();
  const path = `/file/${id}`;

  return (
    <li
      className={classNames({
        [styles.selected]: path === pathname,
      })}
    >
      <Link to={path}>
        <div className={styles.fileName}>
          <StatusIcon
            size={12}
            isSynchronizing={isSynchronizing}
            isModified={isModified}
          />
          <span>{name}</span>
        </div>
      </Link>
      <div className={styles.fileActionIcons}>
        <FaTrash title="Delete File" onClick={() => deleteFile({ id })} />
      </div>
    </li>
  );
};

export default FileItem;
