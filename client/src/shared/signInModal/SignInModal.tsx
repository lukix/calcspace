import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { actions as reduxActions } from '../userDataStore';
import httpRequest from '../httpRequest';
import Spinner from '../spinner';
import { Modal, ModalFormField } from '../modal';
import routes from '../routes';
import sharedStyles from '../shared.module.scss';
import { SignInUpModalsStyles } from '../signInUpModals';
import { setRefreshToken } from '../authTokens';
import styles from './SignInModal.module.scss';

const validationSchema = yup.object().shape({
  username: yup.string().label('Username').required(),
  password: yup.string().label('Password').required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';
const OTHER_ERROR_STATUS = 'OTHER_ERROR_STATUS';

interface LogInModalProps {
  fetchLoggedInUser: Function;
}

const LogInModal: React.FC<LogInModalProps> = ({ fetchLoggedInUser }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }, formikProps) => {
      try {
        formikProps.setStatus(null);
        formikProps.setSubmitting(true);
        const { token, expirationTime } = await httpRequest.post(`users/authenticate`, {
          username,
          password,
        });
        setRefreshToken(token, expirationTime);
        setIsRedirecting(true);
        await fetchLoggedInUser();
      } catch (err) {
        formikProps.setStatus(
          err.response && err.response.status === 401
            ? INVALID_CREDENTIALS_STATUS
            : OTHER_ERROR_STATUS
        );
        formikProps.setSubmitting(false);
      }
    },
  });

  return (
    <Modal visible title="Log In" floating={false} className={styles.signInModal}>
      <div className={SignInUpModalsStyles.modal}>
        <Spinner show={isRedirecting} centered>
          <form onSubmit={formik.handleSubmit}>
            <ModalFormField type="text" name="username" label="Username" formikProps={formik} />
            <ModalFormField type="password" name="password" label="Password" formikProps={formik} />
            <div className={SignInUpModalsStyles.submitButtonWrapper}>
              <input
                type="submit"
                value={formik.isSubmitting ? 'Logging in...' : 'Log in'}
                disabled={formik.isSubmitting}
              />
              <p className={SignInUpModalsStyles.switchPageMessage}>
                Don't have an account? <Link to={routes.signUp.path}>Sign up</Link>.
              </p>
            </div>
            {formik.status === INVALID_CREDENTIALS_STATUS && (
              <p className={sharedStyles.errorMessage}>Invalid username or password.</p>
            )}
            {formik.status === OTHER_ERROR_STATUS && (
              <p className={sharedStyles.errorMessage}>Unexpected error has occurred.</p>
            )}
          </form>
        </Spinner>
      </div>
    </Modal>
  );
};

export default connect(null, {
  fetchLoggedInUser: reduxActions.fetchLoggedInUser,
})(LogInModal);
