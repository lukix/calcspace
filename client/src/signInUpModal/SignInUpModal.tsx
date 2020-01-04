import React, { useState, useEffect } from 'react';
import LogInModal from './LogInModal';
import SignUpModal from './SignUpModal';

interface SignInUpModalProps {
  visible: boolean;
  onHide: Function;
}

const modalModes = {
  LOG_IN: 'LOG_IN',
  SIGN_UP: 'SIGN_UP',
};

const SignInUpModal: React.FC<SignInUpModalProps> = ({ visible, onHide }) => {
  const [mode, setMode] = useState(modalModes.LOG_IN);
  const goToLogInMode = () => setMode(modalModes.LOG_IN);
  const goToSignUpMode = () => setMode(modalModes.SIGN_UP);

  useEffect(() => {
    goToLogInMode();
  }, [visible]);

  const modal = {
    [modalModes.LOG_IN]: (
      <LogInModal
        visible={visible}
        onHide={onHide}
        goToSignUpMode={goToSignUpMode}
      />
    ),
    [modalModes.SIGN_UP]: (
      <SignUpModal
        visible={visible}
        onHide={onHide}
        goToLogInMode={goToLogInMode}
      />
    ),
  }[mode];

  return modal;
};

export default SignInUpModal;
