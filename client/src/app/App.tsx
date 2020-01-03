import React, { useReducer, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import CardsList from '../cardsList/CardsList';
import { getReducer, getInitialState, getCardActions, actions } from './state';
import { loadAppState, persistAppState } from './storage';
import styles from './App.module.scss';

const initializeState = () => loadAppState(localStorage, getInitialState(uuid));

interface AppProps { }

const App: React.FC<AppProps> = () => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, setCards } = bindDispatch(actions, dispatch);

  useEffect(() => {
    if (state) {
      persistAppState(localStorage, state);
    }
  }, [state]);

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>Math Notes</div>
        <div className={styles.icons}>
          <FaPlus
            className={styles.addNewCardIcon}
            title="Add new card"
            onClick={() => addCard()}
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <CardsList
          cards={cards}
          getCardActions={cardId =>
            bindDispatch(getCardActions(cardId), dispatch)
          }
          setCards={setCards}
        />
      </div>
    </div>
  );
};

export default App;
