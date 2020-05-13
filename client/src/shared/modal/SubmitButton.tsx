import React from 'react';
import styles from './Modal.module.scss';

interface SubmitButtonProps {
  value: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ value, disabled = false }) => {
  return (
    <div className={styles.submitButtonWrapper}>
      <input type="submit" value={value} disabled={disabled} />
    </div>
  );
};

export default SubmitButton;
