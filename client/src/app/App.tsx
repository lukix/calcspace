import React, { useReducer, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import HeaderBar from '../headerBar/HeaderBar';
import CodeEditor from '../codeEditor/CodeEditor';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import FilesList from '../filesList/FilesList';
import { getReducer, getInitialState, actions } from './state';
import { actions as reduxActions, selectors } from './store';
import { usePrevious } from './utils';
import { compareStates } from './syncService';
import styles from './App.module.scss';

const initializeState = () => getInitialState(uuid);

interface AppProps {
  user: { username: string } | null;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({ user, fetchLoggedInUser }) => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, updateCode } = bindDispatch(actions, dispatch);

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

  const { id, code } = cards[0];

  return (
    <div className={styles.app}>
      <HeaderBar setIsModalVisible={setIsModalVisible} />
      <div className={styles.contentContainer}>
        <FilesList items={cards} addFile={addCard} />
        <div className={styles.content}>
          <CodeEditor
            code={code}
            updateCode={code => updateCode({ code, id })}
          />
        </div>
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
