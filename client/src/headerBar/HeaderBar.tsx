import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import { SIGN_OUT_URL } from '../config';
import Spinner from '../shared/spinner';
import { selectors } from '../shared/filesStore';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  isSynchronizingAnyFile: boolean;
  areThereAnyChangesToBeSaved: boolean;
  areThereAnySynchronizationErrors: boolean;
  username: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  username,
  isSynchronizingAnyFile,
  areThereAnyChangesToBeSaved,
  areThereAnySynchronizationErrors,
}) => {
  const showSpinner = isSynchronizingAnyFile || areThereAnyChangesToBeSaved;
  const showError = areThereAnySynchronizationErrors && !showSpinner;
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>
        <Link to="/">Math IDE</Link>
        <Spinner
          size={18}
          show={isSynchronizingAnyFile || areThereAnyChangesToBeSaved}
        />
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
        {username && <FaUserCircle title={`Logged in as "${username}"`} />}
      </div>
    </div>
  );
};

export default connect(state => ({
  isSynchronizingAnyFile: selectors.isSynchronizingAnyFile(state),
  areThereAnyChangesToBeSaved: selectors.areThereAnyChangesToBeSaved(state),
  areThereAnySynchronizationErrors: selectors.areThereAnySynchronizationErrors(
    state
  ),
}))(HeaderBar);
