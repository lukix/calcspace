import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Modal from '../modal/Modal';
import ModalFormField from './ModalFormField';
import httpRequest from '../shared/httpRequest';
import styles from './SignInUpModal.module.scss';
import { actions } from '../app/store';

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
  onHide: Function;
  goToSignUpMode: Function;
  setLoggedInUser: ({ username: string }) => void;
}

const LogInModal: React.FC<LogInModalProps> = ({
  visible,
  onHide,
  goToSignUpMode,
  setLoggedInUser,
}) => {
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
        setLoggedInUser({ username });
        onHide();
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
    <Modal visible={visible} onHide={onHide} title="Log In">
      <div className={styles.signInModal}>
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
            <p className={styles.errorMessage}>Invalid username or password.</p>
          )}
        </form>
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
