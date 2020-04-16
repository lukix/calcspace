import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from '../shared/httpRequest';
import { actions } from '../app/store';
import Spinner from '../shared/spinner';
import Modal from './modal/Modal';
import ModalFormField from './ModalFormField';
import AppDescription from './AppDescription';
import styles from './SignInUpModal.module.scss';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .label('Username')
    .required(),
  password: yup
    .string()
    .label('Password')
    .required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';

interface LogInModalProps {
  visible: boolean;
  goToSignUpMode: Function;
}

const LogInModal: React.FC<LogInModalProps> = ({ visible, goToSignUpMode }) => {
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
        formikProps.setStatus(INVALID_CREDENTIALS_STATUS);
      } finally {
        formikProps.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (!visible) {
        formik.resetForm();
      }
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal visible={visible} title="Log In">
      <AppDescription />
      <div className={styles.signInModal}>
        <Spinner show={isRedirecting} centered>
          <form onSubmit={formik.handleSubmit}>
            <ModalFormField
              type="text"
              name="username"
              label="Username"
              formikProps={formik}
            />
            <ModalFormField
              type="password"
              name="password"
              label="Password"
              formikProps={formik}
            />
            <div className={styles.formField}>
              <input
                type="submit"
                value={formik.isSubmitting ? 'Logging in...' : 'Log in'}
                disabled={formik.isSubmitting}
              />
              <p className={styles.signUpMessage}>
                Don't have an account?{' '}
                <span
                  className={styles.linkLikeButton}
                  onClick={() => goToSignUpMode()}
                >
                  Sign up
                </span>
                .
              </p>
            </div>
            {formik.status === INVALID_CREDENTIALS_STATUS && (
              <p className={styles.errorMessage}>
                Invalid username or password.
              </p>
            )}
          </form>
        </Spinner>
      </div>
    </Modal>
  );
};

export default connect(
  null,
  {
    setLoggedInUser: actions.setLoggedInUser,
  }
)(LogInModal);
