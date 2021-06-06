import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FaRegCheckCircle } from 'react-icons/fa';
import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import { Modal, ModalFormField } from '../shared/modal';
import routes from '../shared/routes';
import AppDescription from './AppDescription';
import sharedStyles from '../shared/shared.module.scss';
import { SignInUpModalsStyles } from '../shared/signInUpModals';
import styles from './SignUpPage.module.scss';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .label('Username')
    .min(2)
    .max(30)
    .required()
    .test(
      'leading-trailing-spaces',
      'Leading and trailing spaces are not allowed',
      (value) => (value || '').trim() === value
    ),
  password: yup.string().label('Password').min(6).max(72).required(),
  repeatPassword: yup
    .mixed()
    .label('Repeat password')
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required(),
});

const addedUserAction = ({ username, password }) =>
  httpRequest.post('users', { username, password });

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const [addUser, addedUser, isAddingUser, addUserError] = useAsyncAction(addedUserAction);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }, formikProps) => {
      try {
        const { isUsernameAvailable } = await httpRequest.get(
          `users/username-availability/${username}`
        );
        if (!isUsernameAvailable) {
          formikProps.setFieldError('username', 'This username is already taken');
          return;
        }
      } catch (err) {
        console.error(err);
      }

      addUser({ username, password });
    },
  });

  return (
    <div className={styles.pageContainer}>
      <Modal visible title="Create An Account" floating={false}>
        <AppDescription />
        <div className={SignInUpModalsStyles.modal}>
          {!addedUser ? (
            <form onSubmit={formik.handleSubmit}>
              <ModalFormField type="text" name="username" label="Username" formikProps={formik} />
              <ModalFormField
                type="password"
                name="password"
                label="Password"
                formikProps={formik}
              />
              <ModalFormField
                type="password"
                name="repeatPassword"
                label="Repeat password"
                formikProps={formik}
              />
              <div className={SignInUpModalsStyles.submitButtonWrapper}>
                <input
                  type="submit"
                  value={isAddingUser ? 'Signing Up...' : 'Sign Up'}
                  disabled={isAddingUser}
                />
                <p className={SignInUpModalsStyles.switchPageMessage}>
                  Already have an account? <Link to={routes.logIn.path}>Log in</Link>.
                </p>
              </div>
              {addUserError && (
                <p className={sharedStyles.errorMessage}>
                  Unexpected error has occurred. Signing up failed.
                </p>
              )}
            </form>
          ) : (
            <div className={styles.signUpSuccessMessage}>
              <FaRegCheckCircle />
              <p>
                You have successfully signed up! You can <Link to={routes.logIn.path}>Log in</Link>{' '}
                now.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SignUpPage;
