import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SignInModal, SignUpModal } from '../signInUpModal';
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
        <Route path="/">
          <AuthorizedApp />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
