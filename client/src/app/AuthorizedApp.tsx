import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import SignedInHeaderBar from '../signedInHeaderBar';
import FilePage from '../filePage/FilePage';
import NewFilePage from '../newFilePage/NewFilePage';
import FilesList from '../filesList/FilesList';
import UserGuide from '../shared/userGuide';
import routes from '../shared/routes';
import UnitsList from './UnitsList';
import { selectors } from './store';
import styles from './App.module.scss';

interface AuthorizedAppProps {
  user: { username: string };
  fetchingUserError: boolean;
  showUserModal: Function;
}

const AuthorizedApp: React.FC<AuthorizedAppProps> = ({ user, showUserModal }) => {
  const { pathname } = useLocation();
  const scrollableContentElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContentElement && scrollableContentElement.current) {
      scrollableContentElement.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className={styles.app}>
      <SignedInHeaderBar username={user && user.username} onAvatarClick={showUserModal} />
      <div className={styles.contentContainer}>
        <FilesList />
        <div className={styles.content} ref={scrollableContentElement}>
          <Switch>
            <Route path={routes.newFile.path} exact>
              <NewFilePage />
            </Route>
            <Route path={routes.file.path} exact>
              <FilePage />
            </Route>
            <Route path={routes.unitsList.path} exact>
              <UnitsList />
            </Route>
            <Route path={routes.home.path} exact>
              <UserGuide isSignedIn />
            </Route>
            <Route>
              <Redirect to={routes.home.path} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    user: selectors.user(state),
  }),
  {}
)(AuthorizedApp);
