import React, { useReducer, useEffect } from 'react';
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

import sharedStyles from '../shared/shared.module.scss';
import styles from './App.module.scss';

const initializeState = () => getInitialState(uuid);

interface AppProps {
  user: { username: string } | null;
  isFetchingUser: boolean;
  fetchingUserError: boolean;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({
  user,
  isFetchingUser,
  fetchingUserError,
  fetchLoggedInUser,
}) => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { files } = state;

  const { addFile, updateCode, deleteFile } = bindDispatch(actions, dispatch);

  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  useEffect(() => {
    if (user) {
      console.log('TODO: Fetch files (and discard any existing files)');
    }
  }, [user]);

  if (isFetchingUser) {
    return <div className={sharedStyles.infoBox}>Loading...</div>;
  }

  if (fetchingUserError) {
    return <SignInUpModal visible onHide={() => {}} />;
  }

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <HeaderBar username={user && user.username} />
        <div className={styles.contentContainer}>
          <FilesList items={files} addFile={addFile} deleteFile={deleteFile} />
          <div className={styles.content}>
            <Switch>
              <Route path="/file/:fileId">
                <FilePage files={files} updateCode={updateCode} />
              </Route>
              <Route path="/">
                <div className={sharedStyles.infoBox}>
                  Welcome! Select a file in the left panel to get started.
                </div>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default connect(
  state => ({
    user: selectors.user(state),
    isFetchingUser: selectors.isFetchingUser(state),
    fetchingUserError: selectors.fetchingUserError(state),
  }),
  {
    fetchLoggedInUser: reduxActions.fetchLoggedInUser,
  }
)(App);
