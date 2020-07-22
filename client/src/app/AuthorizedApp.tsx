import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import SignedInHeaderBar from '../signedInHeaderBar';
import FilePage from '../filePage/FilePage';
import NewFilePage from '../newFilePage/NewFilePage';
import FilesList from '../filesList/FilesList';
import UserGuide from '../shared/userGuide';
import routes from '../shared/routes';
import UnitsList from './UnitsList';
import { UserProfileModal } from './userProfileModal';
import { selectors } from './store';
import styles from './App.module.scss';

interface AuthorizedAppProps {
  user: { username: string } | null;
  fetchingUserError: boolean;
}

const AuthorizedApp: React.FC<AuthorizedAppProps> = ({ user, fetchingUserError }) => {
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
    return <Redirect to={routes.logIn.path} />;
  }

  return (
    <div className={styles.app}>
      <SignedInHeaderBar username={user && user.username} onAvatarClick={showUserModal} />
      <div className={styles.contentContainer}>
        <FilesList />
        <div className={styles.content} ref={scrollableContentElement}>
          <Switch>
            <Route path={routes.newFile.path}>
              <NewFilePage />
            </Route>
            <Route path={routes.file.path}>
              <FilePage />
            </Route>
            <Route path={routes.unitsList.path}>
              <UnitsList />
            </Route>
            <Route path={routes.home.path}>
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
    fetchingUserError: selectors.fetchingUserError(state),
  }),
  {}
)(AuthorizedApp);
