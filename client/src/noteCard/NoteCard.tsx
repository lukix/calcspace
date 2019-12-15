import React, { useReducer } from 'react';
import MathExpression from '../mathExpression/MathExpression';
import { reducer, initialState, getActions } from './noteCardState';
import styles from './NoteCard.module.scss';

interface NoteCardProps {}

const NoteCard: React.FC<NoteCardProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { expressions } = state;

  const { addNewExpression, updateExpression, deleteExpression } = getActions(
    dispatch
  );

  return (
    <div className={styles.card}>
      {expressions.map((expression, index) => (
        <MathExpression
          key={index}
          value={expression}
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
