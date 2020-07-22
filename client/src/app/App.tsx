import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Spinner from '../shared/spinner';
import { SignInModal, SignUpModal } from '../signInUpModal';
import SharedEditorDataProvider from '../sharedEditor/SharedEditorDataProvider';
import AuthorizedApp from './AuthorizedApp';
import routes from '../shared/routes';
import { actions as reduxActions, selectors } from './store';

interface AppProps {
  user: { username: string } | null;
  isFetchingUser: boolean;
  fetchingUserError: boolean;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({
  fetchLoggedInUser,
  user,
  isFetchingUser,
  fetchingUserError,
}) => {
  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  if (isFetchingUser || (!user && !fetchingUserError)) {
    return <Spinner centered />;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path={routes.logIn.path}>
          <SignInModal />
        </Route>
        <Route path={routes.signUp.path}>
          <SignUpModal />
        </Route>
        <Route path={routes.sharedEditFile.path}>
          <SharedEditorDataProvider />
        </Route>
        <Route path={routes.sharedViewFile.path}>
          <SharedEditorDataProvider viewOnly />
        </Route>
        <Route path={routes.home.path}>
          <AuthorizedApp />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default connect(
  (state) => ({
    user: selectors.user(state),
    isFetchingUser: selectors.isFetchingUser(state),
    fetchingUserError: selectors.fetchingUserError(state),
  }),
  {
    fetchLoggedInUser: reduxActions.fetchLoggedInUser,
  }
)(App);
