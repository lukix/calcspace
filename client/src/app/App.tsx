import React, { Suspense, lazy, useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../shared/spinner';
import { SignUpModal } from '../signUpModal';
import LandingPage from '../LandingPage';
import AnalyzerPage from '../AnalyzerPage';
import routes from '../shared/routes';
import { hasValidRefreshToken } from '../shared/authTokens';
import { actions as reduxActions, selectors } from '../shared/userDataStore';
import { UserProfileModal } from './userProfileModal';

const AuthorizedApp = lazy(() => import('./AuthorizedApp'));
const SharedEditorDataProvider = lazy(() => import('../sharedEditor/SharedEditorDataProvider'));

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
  const fetchUser = useCallback(async () => {
    await fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const showUserModal = () => setIsUserModalVisible(true);
  const hideUserModal = () => setIsUserModalVisible(false);

  if (hasValidRefreshToken() && (isFetchingUser || (!user && !fetchingUserError))) {
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
            <Suspense fallback={<Spinner centered />}>
              <SharedEditorDataProvider user={user} showUserModal={showUserModal} />
            </Suspense>
          </Route>
          <Route path={routes.sharedViewFile.path} exact>
            <Suspense fallback={<Spinner centered />}>
              <SharedEditorDataProvider user={user} showUserModal={showUserModal} viewOnly />
            </Suspense>
          </Route>
          <Route path={routes.analyzer.path} exact>
            <AnalyzerPage />
          </Route>
          {user && (
            <Route path={routes.home.path}>
              <Suspense fallback={<Spinner centered />}>
                <AuthorizedApp showUserModal={showUserModal} />
              </Suspense>
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
