import React, { useReducer, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaPlus, FaSignInAlt } from 'react-icons/fa';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import CardsList from '../cardsList/CardsList';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import { getReducer, getInitialState, getCardActions, actions } from './state';
import { loadAppState, persistAppState } from './storage';
import { actions as reduxActions, selectors } from './store';
import styles from './App.module.scss';

const initializeState = () => loadAppState(localStorage, getInitialState(uuid));

interface AppProps {
  user: { username: string } | null;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({ user, fetchLoggedInUser }) => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, setCards } = bindDispatch(actions, dispatch);

  useEffect(() => {
    if (state) {
      persistAppState(localStorage, state);
    }
  }, [state]);

  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>
          Math Notes{user && ` - ${user.username}`}
        </div>
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

export default connect(
  state => ({
    user: selectors.user(state),
  }),
  {
    fetchLoggedInUser: reduxActions.fetchLoggedInUser,
  }
)(App);
