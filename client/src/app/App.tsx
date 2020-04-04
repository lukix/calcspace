import React, { useReducer, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import HeaderBar from '../headerBar/HeaderBar';
import FilePage from '../filePage/FilePage';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import FilesList from '../filesList/FilesList';
import { getReducer, getInitialState, actions } from './state';
import { actions as reduxActions, selectors } from './store';
import { usePrevious } from './utils';
import { compareStates } from './syncService';

import sharedStyles from '../shared/shared.module.scss';
import styles from './App.module.scss';

const initializeState = () => getInitialState(uuid);

interface AppProps {
  user: { username: string } | null;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({ user, fetchLoggedInUser }) => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, updateCode, deleteCard } = bindDispatch(actions, dispatch);

  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  useEffect(() => {
    if (user) {
      console.log('TODO: Fetch cards (and discard any existing cards)');
    }
  }, [user]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const previousCards = usePrevious(cards);
  useEffect(() => {
    if (previousCards) {
      compareStates(previousCards, cards);
    }
  }, [cards]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <HeaderBar setIsModalVisible={setIsModalVisible} />
        <div className={styles.contentContainer}>
          <FilesList items={cards} addFile={addCard} deleteFile={deleteCard} />
          <div className={styles.content}>
            <Switch>
              <Route path="/file/:fileId">
                <FilePage cards={cards} updateCode={updateCode} />
              </Route>
              <Route path="/">
                <div className={sharedStyles.infoBox}>
                  Welcome! Select a file in the left panel to get started.
                </div>
              </Route>
            </Switch>
          </div>
        </div>
        <SignInUpModal
          visible={isModalVisible}
          onHide={() => setIsModalVisible(false)}
        />
      </div>
    </BrowserRouter>
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
