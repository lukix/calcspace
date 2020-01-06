import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FaRegCheckCircle } from 'react-icons/fa';
import Modal from '../modal/Modal';
import ModalFormField from './ModalFormField';
import { actions, selectors } from './store';
import styles from './SignInUpModal.module.scss';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .label('Username')
    .min(2)
    .max(30)
    .required(),
  password: yup
    .string()
    .label('Password')
    .min(6)
    .max(72)
    .required(),
  repeatPassword: yup
    .mixed()
    .label('Repeat password')
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required(),
});

interface SignUpModalProps {
  visible: boolean;
  onHide: Function;
  goToLogInMode: Function;

  addUser: Function;
  clearAddedUser: Function;
  isAddingUser: boolean;
  addedUser: object;
  addUserError: { error: string } | null;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  visible,
  onHide,
  goToLogInMode,

  addUser,
  clearAddedUser,
  isAddingUser,
  addedUser,
  addUserError,
}) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema,
    onSubmit: ({ username, password }) => {
      addUser({ username, password });
    },
  });

  useEffect(() => {
    return () => {
      clearAddedUser();
    };
  }, [clearAddedUser]);

  return (
    <Modal visible={visible} onHide={onHide} title="Create An Account">
      <div className={styles.signInModal}>
        {!addedUser ? (
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
            <ModalFormField
              type="password"
              name="repeatPassword"
              label="Repeat password"
              formikProps={formik}
            />
            <div className={styles.formField}>
              <input
                type="submit"
                value={isAddingUser ? 'Signing Up...' : 'Sign Up'}
                disabled={isAddingUser}
              />
              <p className={styles.signUpMessage}>
                Already have an account?{' '}
                <span
                  className={styles.linkLikeButton}
                  onClick={() => goToLogInMode()}
                >
                  Log in
                </span>
                .
              </p>
            </div>
            {addUserError && (
              <p className={styles.errorMessage}>
                Unexpected error has occured. Signing up failed.
              </p>
            )}
          </form>
        ) : (
          <div className={styles.signUpSuccessMessage}>
            <FaRegCheckCircle />
            <p>
              You have successfully signed up! You can{' '}
              <span
                className={styles.linkLikeButton}
                onClick={() => goToLogInMode()}
              >
                Log in
              </span>{' '}
              now.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default connect(
  state => ({
    isAddingUser: selectors.isAddingUser(state),
    addedUser: selectors.addedUser(state),
    addUserError: selectors.addUserError(state),
  }),
  {
    addUser: actions.addUser,
    clearAddedUser: actions.clearAddedUser,
  }
)(SignUpModal);
