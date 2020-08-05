import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../shared/spinner';
import { SignUpModal } from '../signUpModal';
import SharedEditorDataProvider from '../sharedEditor/SharedEditorDataProvider';
import LandingPage from '../LandingPage';
import routes from '../shared/routes';
import { UserProfileModal } from './userProfileModal';
import AuthorizedApp from './AuthorizedApp';
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

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const showUserModal = () => setIsUserModalVisible(true);
  const hideUserModal = () => setIsUserModalVisible(false);

  if (isFetchingUser || (!user && !fetchingUserError)) {
    return <Spinner centered />;
  }

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path={routes.signUp.path} exact>
            <SignUpModal />
          </Route>
          <Route path={routes.sharedEditFile.path} exact>
            <SharedEditorDataProvider user={user} showUserModal={showUserModal} />
          </Route>
          <Route path={routes.sharedViewFile.path} exact>
            <SharedEditorDataProvider user={user} showUserModal={showUserModal} viewOnly />
          </Route>
          {user && (
            <Route path={routes.home.path}>
              <AuthorizedApp showUserModal={showUserModal} />
            </Route>
          )}
          <Route path={routes.home.path} exact>
            <LandingPage />
          </Route>
          <Route>
            <Redirect to={routes.home.path} />
          </Route>
        </Switch>
      </BrowserRouter>
      {isUserModalVisible && <UserProfileModal onHide={hideUserModal} />}
    </>
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
