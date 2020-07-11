import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SignInModal, SignUpModal } from '../signInUpModal';
import SharedEditorDataProvider from '../sharedEditor/SharedEditorDataProvider';
import AuthorizedApp from './AuthorizedApp';
import routes from '../shared/routes';

interface AppProps {}

const App: React.FC<AppProps> = () => {
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

export default App;
