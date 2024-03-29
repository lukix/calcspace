import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { FaTrash, FaPen, FaRegCircle, FaRegDotCircle, FaHourglassEnd } from 'react-icons/fa';

import routes from '../shared/routes';
import styles from './FilesList.module.scss';

const useStateWithReinitialization = (initialValue) => {
  const [state, setState] = useState(initialValue);
  useEffect(() => setState(initialValue), [initialValue]);
  return [state, setState];
};

const validateFileName = (name) => name.toLowerCase().match(/^[a-z0-9. _\-ąćęłńóśżź]+$/);
interface StatusIconProps {
  isSynchronizing: boolean;
  isModified: boolean;
  size: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ isSynchronizing, isModified, size }) => {
  if (isSynchronizing) {
    return <FaHourglassEnd size={size} title="Synchronizing..." />;
  }
  if (isModified) {
    return <FaRegDotCircle size={size} title="Unsaved changes" />;
  }
  return <FaRegCircle size={size} title="Synchronized" />;
};

interface ConditionalLinkProps {
  children: ReactElement;
  enabled: boolean;
  onClick: Function;
  to: string;
}

const ConditionalLink: React.FC<ConditionalLinkProps> = ({ children, enabled, to, onClick }) => {
  if (enabled) {
    return (
      <Link to={to} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
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
  const [editedName, setEditedName] = useStateWithReinitialization(name);

  const isFileNameInvalid = !validateFileName(editedName);

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

  const selectEnterPresses = (func) => (e) => {
    if (e.key === 'Enter') {
      func(e);
    }
  };

  const saveNewName = () => {
    setIsInRenamingMode(false);
    if (!isFileNameInvalid && editedName !== name) {
      renameFile({ id, oldName: name, newName: editedName });
    } else {
      setEditedName(name);
    }
  };

  const path = routes.file.path.replace(':fileId', id);
  const isBusy = isCreating || isDeleting || isRenaming;
  const isSelected = path === pathname;

  const conditionalLinkDisabling = (e) => {
    if (isBusy) {
      e.preventDefault();
    }
  };

  const deleteHandler = () => {
    if (isSelected) {
      historyPush(routes.home.path);
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
      <ConditionalLink enabled={!isInRenamingMode} to={path} onClick={conditionalLinkDisabling}>
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
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={saveNewName}
              onKeyPress={selectEnterPresses(saveNewName)}
              maxLength={30}
              className={classNames({ [styles.invalidFileName]: isFileNameInvalid })}
            />
          ) : (
            <span>{name}</span>
          )}
        </div>
      </ConditionalLink>
      <div className={styles.fileActionIcons}>
        <FaPen title="Rename File" onClick={() => setIsInRenamingMode(true)} />
        <FaTrash title="Delete File" onClick={deleteHandler} />
      </div>
    </li>
  );
};

export default FileItem;
