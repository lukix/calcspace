import React, { useReducer, useState } from 'react';
import bindDispatch from '../shared/bindDispatch';
import MathExpression from '../mathExpression/MathExpression';
import { reducer, getInitialState, actions } from './noteCardState';
import styles from './NoteCard.module.scss';

interface NoteCardProps {
  initialList: Array<{ value: string }>;
}

const NoteCard: React.FC<NoteCardProps> = ({ initialList }) => {
  const [cursorPositionInfo, setCursorPositionInfo] = useState<{
    expressionIndex: number;
    position: number;
  } | null>(null);
  const [state, dispatch] = useReducer(reducer, getInitialState(initialList));
  const { expressions } = state;

  const {
    updateExpression,
    deleteExpression,
    backspaceDeleteExpression,
    enterAddExpression,
  } = bindDispatch(actions, dispatch);

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
    <div className={styles.card}>
      {expressions.map((expression, index) => (
        <MathExpression
          key={index}
          value={expression.value}
          result={expression.result}
          error={expression.error}
          showResult={expression.showResult}
          onValueChange={newValue => updateExpression(index, newValue)}
          onDelete={() => deleteExpression(index)}
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
  );
};

export default NoteCard;
