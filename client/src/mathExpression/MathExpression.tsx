import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import InputWithAutoFocus from './InputWithAutoFocus';
import styles from './MathExpression.module.scss';

interface MathExpressionProps {
  value: string;
  onValueChange: (value: string) => void;
}

const MathExpression: React.FC<MathExpressionProps> = ({
  value,
  onValueChange,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const [isInEditMode, setIsInEditMode] = useState(false);
  const enterEditMode = () => setIsInEditMode(true);
  const leaveEditMode = () => {
    onValueChange(currentValue);
    setIsInEditMode(false);
  };

  const isExpressionEmpty = value.trim() === '';
  const displayValue = isExpressionEmpty ? 'Empty expression' : value;

  return (
    <div
      className={classNames('MathExpression', styles.expression, {
        [styles.isExpressionEmpty]: isExpressionEmpty,
      })}
      onClick={enterEditMode}
    >
      {isInEditMode ? (
        <InputWithAutoFocus
          value={currentValue}
          onChange={e => setCurrentValue(e.target.value)}
          onBlur={leaveEditMode}
          onKeyPress={e => (e.key === 'Enter' ? leaveEditMode() : null)}
        />
      ) : (
        displayValue
      )}
    </div>
  );
};

export default MathExpression;
