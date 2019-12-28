import React, { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import classNames from 'classnames';
import MathExpression from '../mathExpression/MathExpression';
import styles from './NoteCard.module.scss';

interface NoteCardProps {
  expressions: Array<{
    id: string;
    value: string;
    result?: number;
    error?: { message: string };
    showResult: boolean;
  }>;
  updateExpression: Function; // (index: number, newValue: string) => void;
  backspaceDeleteExpression: Function; // (index: number, text: string) => void;
  enterAddExpression: Function; // (index: number, textLeft: string, textRight: string) => void;
  deleteCard: Function;
  isActive: boolean;
  isSomeCardActive: boolean;
  unselect: Function;
}

const NoteCard: React.FC<NoteCardProps> = ({
  expressions,
  updateExpression,
  backspaceDeleteExpression,
  enterAddExpression,
  deleteCard,
  isActive,
  isSomeCardActive,
  unselect,
}) => {
  const [cursorPositionInfo, setCursorPositionInfo] = useState<{
    expressionIndex: number;
    position: number;
  } | null>(null);

  const onEdgeBackspacePress = (index, text) => {
    if (index === 0) {
      return;
    }
    setCursorPositionInfo({
      expressionIndex: index - 1,
      position: expressions[index - 1].value.length,
    });
    backspaceDeleteExpression(index, text);
  };

  const onEnterPress = (index, textLeft, textRight) => {
    setCursorPositionInfo({
      expressionIndex: index + 1,
      position: 0,
    });
    enterAddExpression(index, textLeft, textRight);
  };

  const moveCursorTo = (index, cursorPosition) => {
    if (index < 0 || index >= expressions.length) {
      return;
    }
    setCursorPositionInfo({
      expressionIndex: index,
      position: Math.min(expressions[index].value.length, cursorPosition),
    });
  };

  return (
    <div
      className={classNames(styles.card, {
        [styles.notActive]: !isActive && isSomeCardActive,
      })}
    >
      {isActive && (
        <div className={styles.closeCardButton}>
          <FaTimesCircle onClick={() => unselect()} />
        </div>
      )}
      <div>
        {expressions.map((expression, index) => (
          <MathExpression
            key={expression.id}
            value={expression.value}
            result={expression.result}
            error={expression.error}
            showResult={expression.showResult}
            onValueChange={newValue => updateExpression(index, newValue)}
            onEdgeBackspacePress={text => onEdgeBackspacePress(index, text)}
            onEnterPress={(textLeft, textRight) =>
              onEnterPress(index, textLeft, textRight)
            }
            onDownArrowPress={cursorPosition =>
              moveCursorTo(index + 1, cursorPosition)
            }
            onUpArrowPress={cursorPosition =>
              moveCursorTo(index - 1, cursorPosition)
            }
            cursorPosition={
              cursorPositionInfo && cursorPositionInfo.expressionIndex === index
                ? cursorPositionInfo.position
                : null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default NoteCard;
