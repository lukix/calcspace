import React from 'react';
import { FaPlus } from 'react-icons/fa';
import NoteCard from '../noteCard/NoteCard';
import styles from './App.module.scss';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>Math Notes</div>
        <div className={styles.icons}>
          <FaPlus className={styles.addNewCardIcon} title="Add new card" />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <NoteCard initialList={[{ value: '' }]} />
      </div>
    </div>
  );
};

export default App;
