import React, { useRef, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
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
  const [showResultInNewLine, setShowResultInNewLine] = useState(false);
  const valueDisplayElement = useRef<HTMLDivElement>(null);
  const valueTextElement = useRef<HTMLSpanElement>(null);

  const determineHowToDisplayResult = useCallback(() => {
    if (!valueDisplayElement.current || !valueTextElement.current) {
      return;
    }
    const resultFitsInOneLine =
      valueTextElement.current.offsetWidth <=
      valueDisplayElement.current.offsetWidth;
    setShowResultInNewLine(!resultFitsInOneLine);
  }, []);

  useEffect(() => {
    determineHowToDisplayResult();
  }, [determineHowToDisplayResult, result]);

  useEffect(() => {
    window.addEventListener('resize', determineHowToDisplayResult);
    return () => {
      window.removeEventListener('resize', determineHowToDisplayResult);
    };
  }, [determineHowToDisplayResult]);

  const isExpressionEmpty = value.trim() === '';
  const resultToDisplay = showResult && result !== null && ` = ${result}`;
  const displayValue = isExpressionEmpty
    ? 'Empty expression'
    : `${value}${resultToDisplay || ''}`;

  return (
    <div>
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
          <div className={styles.valueDisplay} ref={valueDisplayElement}>
            <span
              className={classNames(styles.valueText, {
                [styles.visible]: !showResultInNewLine,
              })}
              ref={valueTextElement}
            >
              {displayValue}
            </span>
          </div>
        </div>
        <div className={styles.controls}>
          {error && <FaExclamationCircle title={error.message} />}
        </div>
      </div>
      <div
        className={classNames(styles.newLineResult, {
          [styles.visible]: showResultInNewLine,
        })}
      >
        {`= ${result}`}
      </div>
    </div>
  );
};

export default MathExpression;
