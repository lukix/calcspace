import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import { SIGN_OUT_URL } from '../config';
import Spinner from '../shared/spinner';
import { selectors, actions } from '../shared/filesStore';
import HeaderBar from '../shared/headerBar';
import routes from '../shared/routes';
import { clearAuthToken } from '../shared/authToken';
import styles from './SignedInHeaderBar.module.scss';

interface SignedInHeaderBarProps {
  username: string | null;
  onAvatarClick: () => void;
  isToggleButtonVisible?: boolean;

  isFilesPanelVisible: boolean;
  isSynchronizingAnyFile: boolean;
  areThereAnyChangesToBeSaved: boolean;
  areThereAnySynchronizationErrors: boolean;
  setFilesPanelVisible: Function;
}

const SignedInHeaderBar: React.FC<SignedInHeaderBarProps> = ({
  username,
  onAvatarClick,
  isToggleButtonVisible = true,

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
    <HeaderBar
      headerTitle={
        <>
          {isToggleButtonVisible && (
            <FaBars
              className={styles.menuToggleButton}
              onClick={toggleFilesPanel}
              title="Toggle files panel visibility"
            />
          )}
          <Link to={routes.home.path}>CalcSpace.com</Link>
          <Spinner size={18} show={isSynchronizingAnyFile || areThereAnyChangesToBeSaved} />
          {showError && (
            <FaExclamationCircle
              title="Saving changes failed. Edit unsaved files to retry."
              className={styles.errorIcon}
            />
          )}
        </>
      }
      icons={
        <>
          <a href={SIGN_OUT_URL} className={styles.signOutLink} onClick={clearAuthToken}>
            Log Out
          </a>
          {username && <FaUserCircle title="Account Settings" onClick={onAvatarClick} />}
        </>
      }
    />
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
)(SignedInHeaderBar);
