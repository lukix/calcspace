import React from 'react';
import Modal from '../modal/Modal';
import styles from './SignInUpModal.module.scss';

interface LogInModalProps {
  visible: boolean;
  onHide: Function;
  goToSignUpMode: Function;
}

const LogInModal: React.FC<LogInModalProps> = ({
  visible,
  onHide,
  goToSignUpMode,
}) => {
  return (
    <Modal visible={visible} onHide={onHide} title="Log In">
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
            <input type="submit" value="Log In" />
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
        </form>
      </div>
    </Modal>
  );
};

export default LogInModal;
