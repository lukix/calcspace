import React from 'react';
import classNames from 'classnames';
import styles from './RadioButtons.module.scss';

interface RadioButtonsProps {
  items: Array<{ value: string; label: string; description?: string }>;
  value: string;
  onChange: Function;
  className?: string;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  items,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={classNames(styles.radioButtons, className)}>
      {items.map(item => (
        <div
          key={item.value}
          className={classNames(styles.item, {
            [styles.selected]: item.value === value,
          })}
          onClick={() => onChange(item.value)}
          title={item.description || ''}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
