import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import { SIGN_OUT_URL } from '../config';
import Spinner from '../shared/spinner';
import { selectors, actions } from '../shared/filesStore';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  username: string | null;
  onAvatarClick: () => void;

  isFilesPanelVisible: boolean;
  isSynchronizingAnyFile: boolean;
  areThereAnyChangesToBeSaved: boolean;
  areThereAnySynchronizationErrors: boolean;
  setFilesPanelVisible: Function;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  username,
  onAvatarClick,
  isFilesPanelVisible,
  isSynchronizingAnyFile,
  areThereAnyChangesToBeSaved,
  areThereAnySynchronizationErrors,
  setFilesPanelVisible,
}) => {
  const showSpinner = isSynchronizingAnyFile || areThereAnyChangesToBeSaved;
  const showError = areThereAnySynchronizationErrors && !showSpinner;
  const toggleFilesPanel = () => {
    setFilesPanelVisible(!isFilesPanelVisible);
  };
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>
        <FaBars
          className={styles.menuToggleButton}
          onClick={toggleFilesPanel}
          title="Toggle files panel visibility"
        />
        <Link to="/">Math IDE</Link>
        <Spinner size={18} show={isSynchronizingAnyFile || areThereAnyChangesToBeSaved} />
        {showError && (
          <FaExclamationCircle
            title="Saving changes failed. Edit unsaved files to retry."
            className={styles.errorIcon}
          />
        )}
      </div>
      <div className={styles.icons}>
        <a href={SIGN_OUT_URL} className={styles.signOutLink}>
          Log Out
        </a>
        {username && <FaUserCircle title="Account Settings" onClick={onAvatarClick} />}
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    isFilesPanelVisible: selectors.isFilesPanelVisible(state),
    isSynchronizingAnyFile: selectors.isSynchronizingAnyFile(state),
    areThereAnyChangesToBeSaved: selectors.areThereAnyChangesToBeSaved(state),
    areThereAnySynchronizationErrors: selectors.areThereAnySynchronizationErrors(state),
  }),
  {
    setFilesPanelVisible: actions.setFilesPanelVisible,
  }
)(HeaderBar);
