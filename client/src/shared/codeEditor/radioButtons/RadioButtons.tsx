import React from 'react';
import classNames from 'classnames';
import styles from './RadioButtons.module.scss';

interface RadioButtonsProps {
  items: Array<{
    value: string | boolean | number | null;
    label: string;
    description?: string;
    icon: React.ReactNode;
  }>;
  value: string | boolean | number | null;
  onChange: Function;
  className?: string;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ items, value, onChange, className = '' }) => {
  return (
    <div className={classNames(styles.radioButtons, className)}>
      {items.map((item) => (
        <div
          key={`${item.value}`}
          className={classNames(styles.item, {
            [styles.selected]: item.value === value,
          })}
          onClick={() => onChange(item.value)}
          title={item.description || ''}
        >
          <span className="radio-button-icon">{item.icon}</span>{' '}
          <span className="radio-button-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
