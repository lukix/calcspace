import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import AuthorizedApp from './AuthorizedApp';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/log-in">
          <SignInUpModal visible onHide={() => {}} />
        </Route>
        <Route path="/">
          <AuthorizedApp />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
