import React, { useState } from 'react';

import styles from './App.module.scss';
import ShopsList from '../shopsList/ShopsList.container';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [listVisible, setListVisible] = useState(false);
  const toggleShowList = () => setListVisible(visible => !visible);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        {listVisible && <ShopsList />}
        <span className={styles.appLink} onClick={toggleShowList}>
          {listVisible ? 'Hide' : 'Show'}
        </span>
      </header>
    </div>
  );
};

export default App;
