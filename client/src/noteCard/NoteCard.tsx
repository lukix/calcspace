import React, { useReducer } from 'react';
import bindDispatch from '../shared/bindDispatch';
import MathExpression from '../mathExpression/MathExpression';
import { reducer, initialState, actions } from './noteCardState';
import styles from './NoteCard.module.scss';

interface NoteCardProps {}

const NoteCard: React.FC<NoteCardProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { expressions } = state;

  const { addNewExpression, updateExpression, deleteExpression } = bindDispatch(
    actions,
    dispatch
  );

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
        />
      ))}
      <button
        className={styles.addExpressionButton}
        onClick={() => addNewExpression()}
      >
        Add new line
      </button>
    </div>
  );
};

export default NoteCard;
