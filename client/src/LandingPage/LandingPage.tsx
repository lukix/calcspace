import React from 'react';
import { SignInModal } from '../signInUpModal';
import CodeSnippet from './CodeSnippet/index';
import styles from './LandingPage.module.scss';

const snippets = {
  COMPLEX_CALCULATIONS: `x = 3
    y = 8 / 2
    sqrt(x^2 + y^2)`,
  CONVERTING_UNITS: `g = 9.81m/s^2
    m = 100kg + 45lb
    h = 6ft + 3in

    // Potential energy:
    E = m * g * h = [kJ]`,
  FIND_MISTAKES: `m = 10kg
    v = 7.2km/h
    E = (m*v)/2 = [J]`,
};

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
          <CodeSnippet code={snippets.COMPLEX_CALCULATIONS} />
          <h2>Don't waste time converting units by hand</h2>
          <CodeSnippet code={snippets.CONVERTING_UNITS} />
          <h2>Find mistakes in your calculations with no effort</h2>
          <CodeSnippet code={snippets.FIND_MISTAKES} />
        </div>
        <div className={styles.modalsContainer}>
          <SignInModal />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
