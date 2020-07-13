import React from 'react';
import classNames from 'classnames';
import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: Function;
  className?: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  value,
  onChange,
  className = '',
  description = '',
  icon = null,
  disabled = false,
}) => {
  return (
    <div className={classNames(styles.toggleButton, className)}>
      <div
        className={classNames(styles.item, {
          [styles.selected]: value,
        })}
        onClick={disabled ? () => {} : () => onChange(!value)}
        title={description}
      >
        <span className="toggle-button-icon">{icon}</span>{' '}
        <span className="toggle-button-label">{label}</span>
      </div>
    </div>
  );
};

export default ToggleButton;
