import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

import HeaderBar from '../shared/headerBar';
import Spinner from '../shared/spinner';
import routes from '../shared/routes';

import { syncStatuses } from './constants';
import styles from './SharedEditor.module.scss';

interface SharedEditorHeaderBarProps {
  syncStatus: string;
}

const SharedEditorHeaderBar: React.FC<SharedEditorHeaderBarProps> = ({ syncStatus }) => {
  return (
    <HeaderBar
      headerTitle={
        <>
          <Link to={routes.home.path}>CalcSpace.com</Link>
          <Spinner
            size={18}
            show={[syncStatuses.DIRTY, syncStatuses.STARTED].includes(syncStatus)}
          />
          {syncStatus === syncStatuses.FAILED && (
            <FaExclamationCircle
              title="Saving changes failed. Make same changes to retry."
              className={styles.errorIcon}
            />
          )}
        </>
      }
      icons={
        <div className={styles.headerLinks}>
          <Link to={routes.home.path}>Log In</Link> / <Link to={routes.signUp.path}>Sign Up</Link>
        </div>
      }
    />
  );
};

export default SharedEditorHeaderBar;
