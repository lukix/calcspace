import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../shared/spinner';
import Modal from '../shared/modal/Modal';
import HeaderBar from '../headerBar/HeaderBar';
import FilePage from '../filePage/FilePage';
import FilesList from '../filesList/FilesList';
import UserGuide from './UserGuide';
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
        <div className={styles.content}>
          <Switch>
            <Route path="/file/:fileId">
              <FilePage />
            </Route>
            <Route path="/">
              <UserGuide />
            </Route>
          </Switch>
        </div>
      </div>
      <Modal visible={isUserModalVisible} onHide={hideUserModal}>
        TODO: Changing password
      </Modal>
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
