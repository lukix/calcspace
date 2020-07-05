import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SignInModal, SignUpModal } from '../signInUpModal';
import SharedEditorDataProvider from '../sharedEditor/SharedEditorDataProvider';
import AuthorizedApp from './AuthorizedApp';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/log-in">
          <SignInModal />
        </Route>
        <Route path="/sign-up">
          <SignUpModal />
        </Route>
        <Route path="/shared/edit/:id">
          <SharedEditorDataProvider />
        </Route>
        <Route path="/shared/view/:id">
          <SharedEditorDataProvider viewOnly />
        </Route>
        <Route path="/">
          <AuthorizedApp />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
