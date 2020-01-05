import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Modal from '../modal/Modal';
import ModalFormField from './ModalFormField';
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
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  visible,
  onHide,
  goToLogInMode,
}) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Modal visible={visible} onHide={onHide} title="Create An Account">
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
          <ModalFormField
            type="password"
            name="repeatPassword"
            label="Repeat password"
            formikProps={formik}
          />
          <div className={styles.formField}>
            <input type="submit" value="Sign Up" />
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
        </form>
      </div>
    </Modal>
  );
};

export default SignUpModal;
