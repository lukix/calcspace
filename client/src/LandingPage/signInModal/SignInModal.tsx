import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Switch, Case, Default } from 'react-when-then';

import httpRequest from '../../shared/httpRequest';
import Spinner from '../../shared/spinner';
import { Modal, ModalFormField } from '../../shared/modal';
import routes from '../../shared/routes';
import useCreateAndOpenSharedFile from '../../shared/useCreateAndOpenSharedFile';
import sharedStyles from '../../shared/shared.module.scss';
import { SignInUpModalsStyles } from '../../shared/signInUpModals';
import { setRefreshToken } from '../../shared/authTokens';
import styles from './SignInModal.module.scss';

const createSharedFileAction = () => httpRequest.post(`shared-files`);

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
        const { token, expirationTime } = await httpRequest.post(`users/authenticate`, {
          username,
          password,
        });
        setRefreshToken(token, expirationTime);
        setIsRedirecting(true);
        window.location.replace(routes.home.path);
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

  const {
    createSharedFile,
    isCreatingSharedFile,
    creatingSharedFileError,
  } = useCreateAndOpenSharedFile(createSharedFileAction);

  return (
    <>
      <Modal visible title="Log In" floating={false} className={styles.signInModal}>
        <div className={SignInUpModalsStyles.modal}>
          <Spinner show={isRedirecting} centered>
            <form onSubmit={formik.handleSubmit}>
              <ModalFormField type="text" name="username" label="Username" formikProps={formik} />
              <ModalFormField
                type="password"
                name="password"
                label="Password"
                formikProps={formik}
              />
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
      <Modal
        visible
        title="Try Without Signing In"
        floating={false}
        className={styles.tryWithoutAccountModal}
      >
        <Spinner show={isCreatingSharedFile} centered>
          <button onClick={createSharedFile}>
            <Switch>
              <Case when={creatingSharedFileError}>Error occured. Click to try again.</Case>
              <Default>Start now!</Default>
            </Switch>
          </button>
        </Spinner>
      </Modal>
    </>
  );
};

export default LogInModal;
