import React from 'react';
import { SignInModal } from '../shared/signInModal';
import styles from './LogInPage.module.scss';

interface LogInPageProps {}

const LogInPage: React.FC<LogInPageProps> = () => {
  return (
    <div className={styles.pageContainer}>
      <SignInModal />
    </div>
  );
};

export default LogInPage;
