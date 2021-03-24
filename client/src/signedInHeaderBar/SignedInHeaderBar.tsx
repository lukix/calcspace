import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import Spinner from '../shared/spinner';
import { selectors, actions } from '../shared/filesStore';
import {
  selectors as userDataSelectors,
  actions as userDataActions,
} from '../shared/userDataStore';
import HeaderBar from '../shared/headerBar';
import routes from '../shared/routes';
import styles from './SignedInHeaderBar.module.scss';

interface SignedInHeaderBarProps {
  username: string | null;
  onAvatarClick: Function;
  isToggleButtonVisible?: boolean;

  isFilesPanelVisible: boolean;
  isSynchronizingAnyFile: boolean;
  areThereAnyChangesToBeSaved: boolean;
  areThereAnySynchronizationErrors: boolean;
  setFilesPanelVisible: Function;
  isLoggingOut: boolean;
  logOut: Function;
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
  isLoggingOut,
  logOut,
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
          <Spinner size={18} show={isLoggingOut} />
          <button className={styles.signOutLink} disabled={isLoggingOut} onClick={() => logOut()}>
            {isLoggingOut ? 'Logging Out' : 'Log Out'}
          </button>
          {username && <FaUserCircle title="Account Settings" onClick={() => onAvatarClick()} />}
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
    isLoggingOut: userDataSelectors.isLoggingOut(state),
  }),
  {
    setFilesPanelVisible: actions.setFilesPanelVisible,
    logOut: userDataActions.logOut,
  }
)(SignedInHeaderBar);
