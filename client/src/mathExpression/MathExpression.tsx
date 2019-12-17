import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FaTrash, FaExclamationCircle } from 'react-icons/fa';
import InputWithAutoFocus from './InputWithAutoFocus';
import styles from './MathExpression.module.scss';

interface MathExpressionProps {
  value: string;
  result?: number;
  error?: { message: string };
  onValueChange: (value: string) => void;
  onDelete: () => void;
}

const MathExpression: React.FC<MathExpressionProps> = ({
  value,
  result,
  error,
  onValueChange,
  onDelete,
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
  const displayValueWithResult =
    result === null ? displayValue : `${displayValue} = ${result}`;

  return (
    <div
      className={classNames('MathExpression', styles.expression, {
        [styles.isExpressionEmpty]: isExpressionEmpty,
      })}
    >
      <div className={styles.value} onClick={enterEditMode}>
        {isInEditMode ? (
          <InputWithAutoFocus
            value={currentValue}
            onChange={e => setCurrentValue(e.target.value)}
            onBlur={leaveEditMode}
            onKeyPress={e => (e.key === 'Enter' ? leaveEditMode() : null)}
          />
        ) : (
          displayValueWithResult
        )}
      </div>
      <div className={styles.controls}>
        {error && <FaExclamationCircle title={error.message} />}
        <FaTrash onClick={onDelete} title="Delete expression" />
      </div>
    </div>
  );
};

export default MathExpression;
