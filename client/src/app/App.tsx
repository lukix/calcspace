import React, { useReducer, useEffect, useState } from 'react';
import { FaPlus, FaSignInAlt } from 'react-icons/fa';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import CardsList from '../cardsList/CardsList';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import { getReducer, getInitialState, getCardActions, actions } from './state';
import { loadAppState, persistAppState } from './storage';
import styles from './App.module.scss';

const initializeState = () => loadAppState(localStorage, getInitialState(uuid));

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, setCards } = bindDispatch(actions, dispatch);

  useEffect(() => {
    if (state) {
      persistAppState(localStorage, state);
    }
  }, [state]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>Math Notes</div>
        <div className={styles.icons}>
          <FaPlus title="Add new card" onClick={() => addCard()} />
          <FaSignInAlt
            title="Sign in / Sign up"
            onClick={() => setIsModalVisible(true)}
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
      <SignInUpModal
        visible={isModalVisible}
        onHide={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default App;
