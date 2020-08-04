import React from 'react';
import { SignInModal } from '../signInUpModal';
import styles from './LandingPage.module.scss';

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>CalcSpace.com</h1>
      </header>
      <div className={styles.mainContainer}>
        <div>
          <h2>Build complex multi-line calculations and see results as you type</h2>
          <div className={styles.codeSnippet}></div>
          <h2>Don't waste time converting units by hand</h2>
          <div className={styles.codeSnippet}></div>
          <h2>Find mistakes in your calculations with no effort</h2>
          <div className={styles.codeSnippet}></div>
        </div>
        <div className={styles.modalsContainer}>
          <SignInModal />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
