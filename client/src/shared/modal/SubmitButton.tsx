import React from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';

interface SubmitButtonProps {
  value: string;
  className?: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ value, className, disabled = false }) => {
  return (
    <div className={classNames(styles.submitButtonWrapper, className)}>
      <input type="submit" value={value} disabled={disabled} />
    </div>
  );
};

export default SubmitButton;
