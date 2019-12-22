import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import ExpressionInput from './ExpressionInput';
import styles from './MathExpression.module.scss';

interface MathExpressionProps {
  value: string;
  result?: number;
  error?: { message: string };
  showResult: boolean;
  onValueChange: (value: string) => void;
  onEdgeBackspacePress: (text: string) => void;
  onEnterPress: (textBeforeCursor: string, textAfterCursor: string) => void;
  onDownArrowPress: (cursonPosition: number) => void;
  onUpArrowPress: (cursonPosition: number) => void;
  cursorPosition: number | null;
}

const MathExpression: React.FC<MathExpressionProps> = ({
  value,
  result,
  error,
  showResult,
  onValueChange,
  onEdgeBackspacePress,
  onEnterPress,
  onDownArrowPress,
  onUpArrowPress,
  cursorPosition,
}) => {
  const isExpressionEmpty = value.trim() === '';
  const resultToDisplay = showResult && result !== null && ` = ${result}`;
  const displayValue = isExpressionEmpty
    ? 'Empty expression'
    : `${value}${resultToDisplay || ''}`;

  return (
    <div className={`math-expression ${styles.expression}`}>
      <div className={styles.value}>
        <div className={styles.valueInput}>
          <ExpressionInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
            onEdgeBackspaceKeyDown={onEdgeBackspacePress}
            onEnterKeyDown={onEnterPress}
            onDownArrowKeyDown={onDownArrowPress}
            onUpArrowKeyDown={onUpArrowPress}
            cursorPosition={cursorPosition}
            maxLength={80}
          />
        </div>
        <div className={styles.valueDisplay}>
          <span className={styles.valueText}>{displayValue}</span>
        </div>
      </div>
      <div className={styles.controls}>
        {error && <FaExclamationCircle title={error.message} />}
      </div>
    </div>
  );
};

export default MathExpression;
