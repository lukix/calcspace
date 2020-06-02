import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from '../shared/httpRequest';
import Spinner from '../shared/spinner';
import { Modal, ModalFormField } from '../shared/modal';
import AppDescription from './AppDescription';
import sharedStyles from '../shared/shared.module.scss';
import styles from './SignInUpModal.module.scss';

const validationSchema = yup.object().shape({
  username: yup.string().label('Username').required(),
  password: yup.string().label('Password').required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';
const OTHER_ERROR_STATUS = 'OTHER_ERROR_STATUS';

interface LogInModalProps {}

const LogInModal: React.FC<LogInModalProps> = () => {
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
        await httpRequest.post(`users/authenticate`, { username, password });
        setIsRedirecting(true);
        window.location.replace('/');
      } catch (err) {
        formikProps.setStatus(
          err.response && err.response.status === 401
            ? INVALID_CREDENTIALS_STATUS
            : OTHER_ERROR_STATUS
        );
      } finally {
        formikProps.setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.pageContainer}>
      <Modal visible title="Log In" floating={false}>
        <AppDescription />
        <div className={styles.signInModal}>
          <Spinner show={isRedirecting} centered>
            <form onSubmit={formik.handleSubmit}>
              <ModalFormField type="text" name="username" label="Username" formikProps={formik} />
              <ModalFormField
                type="password"
                name="password"
                label="Password"
                formikProps={formik}
              />
              <div className={styles.submitButtonWrapper}>
                <input
                  type="submit"
                  value={formik.isSubmitting ? 'Logging in...' : 'Log in'}
                  disabled={formik.isSubmitting}
                />
                <p className={styles.signUpMessage}>
                  Don't have an account? <Link to="/sign-up">Sign up</Link>.
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
      <div className={styles.noAccountButtonWrapper}>
        <button>Try without an account</button>
      </div>
    </div>
  );
};

export default LogInModal;
