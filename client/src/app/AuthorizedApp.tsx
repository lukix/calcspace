import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Spinner from '../shared/spinner';
import HeaderBar from '../headerBar/HeaderBar';
import FilePage from '../filePage/FilePage';
import NewFilePage from '../newFilePage/NewFilePage';
import FilesList from '../filesList/FilesList';
import UserGuide from './UserGuide';
import UnitsList from './UnitsList';
import { UserProfileModal } from './userProfileModal';
import { actions as reduxActions, selectors } from './store';
import styles from './App.module.scss';

interface AuthorizedAppProps {
  user: { username: string } | null;
  isFetchingUser: boolean;
  fetchingUserError: boolean;
  fetchLoggedInUser: Function;
}

const AuthorizedApp: React.FC<AuthorizedAppProps> = ({
  user,
  isFetchingUser,
  fetchingUserError,
  fetchLoggedInUser,
}) => {
  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  const { pathname } = useLocation();
  const scrollableContentElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContentElement && scrollableContentElement.current) {
      scrollableContentElement.current.scrollTo(0, 0);
    }
  }, [pathname]);

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const showUserModal = () => setIsUserModalVisible(true);
  const hideUserModal = () => setIsUserModalVisible(false);

  if (fetchingUserError) {
    return <Redirect to="/log-in" />;
  }

  if (isFetchingUser || !user) {
    return <Spinner centered />;
  }

  return (
    <div className={styles.app}>
      <HeaderBar username={user && user.username} onAvatarClick={showUserModal} />
      <div className={styles.contentContainer}>
        <FilesList />
        <div className={styles.content} ref={scrollableContentElement}>
          <Switch>
            <Route path="/new-file">
              <NewFilePage />
            </Route>
            <Route path="/file/:fileId">
              <FilePage />
            </Route>
            <Route path="/units-list">
              <UnitsList />
            </Route>
            <Route path="/">
              <UserGuide isSignedIn />
            </Route>
          </Switch>
        </div>
      </div>
      {isUserModalVisible && <UserProfileModal onHide={hideUserModal} />}
    </div>
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
)(AuthorizedApp);
