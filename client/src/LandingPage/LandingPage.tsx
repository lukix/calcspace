import React, { Suspense, lazy, useState, useEffect } from 'react';
import Spinner from '../shared/spinner';
import { SignInModal } from '../shared/signInModal';
import { StartNowModal } from './startNowModal';
import { StartNowButton } from './startNowButton';
import { SignInButton } from './signInButton';
import {
  COMPLEX_CALCULATIONS_FRAMES,
  CONVERTING_UNITS_FRAMES,
  FINDING_MISTAKES_FRAMES,
} from './snippetsFrames';
import styles from './LandingPage.module.scss';

const CodeSnippet = lazy(() => import('./CodeSnippet/index'));

const useAnimatedString = (frames: { value: string; delay: number }[]): string => {
  const [frameIndex, setFrameIndex] = useState(0);

  const currentFrame = frames[frameIndex];

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFrameIndex((index) => (index + 1) % frames.length);
    }, currentFrame.delay);

    return () => clearInterval(timerId);
  }, [frames, currentFrame]);

  return currentFrame?.value || '';
};

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  const complexCalculationsCode = useAnimatedString(COMPLEX_CALCULATIONS_FRAMES);
  const convertingUnitsCode = useAnimatedString(CONVERTING_UNITS_FRAMES);
  const findingMistakesCode = useAnimatedString(FINDING_MISTAKES_FRAMES);

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>CalcSpace.com</h1>
      </header>
      <div className={styles.mainContainer}>
        <div className={styles.snippetsContainer}>
          <h2>About</h2>
          <p>
            <b>CalcSpace.com</b> lets you build multi-line calculations and instantly see the
            results. It supports units of measurement, so it's great for physics and engineering.
            Sharing mechanism makes it easy to collaborate with other people.
          </p>
          <Suspense fallback={<Spinner centered />}>
            <h2>Build complex multi-line calculations and see results as you type</h2>
            <CodeSnippet code={complexCalculationsCode} />
            <h2>Don't waste time converting units by hand</h2>
            <CodeSnippet code={convertingUnitsCode} />
            <h2>Find mistakes in your calculations with no effort</h2>
            <CodeSnippet code={findingMistakesCode} />
          </Suspense>
        </div>
        <div className={styles.modalsContainer}>
          <div className={styles.modalsInnerWrapper}>
            <SignInModal />
            <StartNowModal />
          </div>
        </div>
        <div className={styles.modalsContainerCompact}>
          <div className={styles.modalsInnerWrapper}>
            <StartNowButton />
            <SignInButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
