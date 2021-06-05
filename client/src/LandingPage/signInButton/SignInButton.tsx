import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../shared/routes';
import styles from './SignInButton.module.scss';

interface SignInButtonProps {}

const SignInButton: React.FC<SignInButtonProps> = () => {
  return (
    <Link to={routes.logIn.path} className={styles.signInButtonLink}>
      <button className={styles.signInButton}>Log In</button>
    </Link>
  );
};

export default SignInButton;
