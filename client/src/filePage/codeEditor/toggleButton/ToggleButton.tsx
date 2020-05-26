import React from 'react';
import classNames from 'classnames';
import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: Function;
  className?: string;
  description?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  value,
  onChange,
  className = '',
  description = '',
}) => {
  return (
    <div className={classNames(styles.toggleButton, className)}>
      <div
        className={classNames(styles.item, {
          [styles.selected]: value,
        })}
        onClick={() => onChange(!value)}
        title={description}
      >
        {label}
      </div>
    </div>
  );
};

export default ToggleButton;
