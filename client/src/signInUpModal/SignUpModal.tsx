import React from 'react';
import Modal from '../modal/Modal';
import styles from './SignInUpModal.module.scss';

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
  return (
    <Modal visible={visible} onHide={onHide} title="Create An Account">
      <div className={styles.signInModal}>
        <form>
          <div className={styles.formField}>
            <label>Username:</label>
            <input type="text" />
          </div>
          <div className={styles.formField}>
            <label>Password:</label>
            <input type="password" />
          </div>
          <div className={styles.formField}>
            <label>Repeat password:</label>
            <input type="password" />
          </div>
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
