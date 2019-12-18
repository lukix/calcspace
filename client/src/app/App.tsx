import React from 'react';
import NoteCard from '../noteCard/NoteCard';
import styles from './App.module.scss';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <div className={styles.headerBar}>Math Notes</div>
      <div className={styles.contentContainer}>
        <NoteCard initialList={[{ value: '' }]} />
      </div>
    </div>
  );
};

export default App;
