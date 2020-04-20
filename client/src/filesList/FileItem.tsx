import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import {
  FaTrash,
  FaPen,
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
  renameFile: Function;
  isSynchronizing?: boolean;
  isModified?: boolean;
  isCreating?: boolean;
  isDeleting?: boolean;
  isRenaming?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  id,
  name,
  deleteFile,
  renameFile,
  isSynchronizing = false,
  isModified = false,
  isCreating = false,
  isDeleting = false,
  isRenaming = false,
}) => {
  const { pathname } = useLocation();
  const { push: historyPush } = useHistory();
  const [isInRenamingMode, setIsInRenamingMode] = useState(false);
  const textInput = useRef<HTMLInputElement>(null);

  const focusTextInput = () => {
    if (textInput.current) {
      textInput.current.focus();
    }
  };

  useEffect(() => {
    if (isInRenamingMode) {
      focusTextInput();
    }
  }, [isInRenamingMode]);

  const selectEnterPresses = func => e => {
    if (e.key === 'Enter') {
      func(e);
    }
  };

  const saveNewName = e => {
    setIsInRenamingMode(false);
    const newName = e.target.value.trim();
    if (newName) {
      renameFile({ id, oldName: name, newName });
    }
  };

  const path = `/file/${id}`;
  const isBusy = isCreating || isDeleting || isRenaming;
  const isSelected = path === pathname;

  const conditionalLinkDisabling = e => {
    if (isBusy) {
      e.preventDefault();
    }
  };

  const deleteHandler = () => {
    if (isSelected) {
      historyPush('/');
    }
    deleteFile({ id });
  };

  return (
    <li
      className={classNames({
        [styles.selected]: isSelected,
        [styles.isBusy]: isBusy,
      })}
    >
      <Link to={path} onClick={conditionalLinkDisabling}>
        <div className={styles.fileName}>
          <StatusIcon
            size={12}
            isSynchronizing={Boolean(isSynchronizing || isBusy)}
            isModified={isModified}
          />

          {isInRenamingMode ? (
            <input
              ref={textInput}
              type="text"
              defaultValue={name}
              onBlur={saveNewName}
              onKeyPress={selectEnterPresses(saveNewName)}
              maxLength={30}
            />
          ) : (
            <span>{name}</span>
          )}
        </div>
      </Link>
      <div className={styles.fileActionIcons}>
        <FaPen title="Rename File" onClick={() => setIsInRenamingMode(true)} />
        <FaTrash title="Delete File" onClick={deleteHandler} />
      </div>
    </li>
  );
};

export default FileItem;
