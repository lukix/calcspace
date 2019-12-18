import React, { useReducer } from 'react';
import bindDispatch from '../shared/bindDispatch';
import MathExpression from '../mathExpression/MathExpression';
import { reducer, getInitialState, actions } from './noteCardState';
import styles from './NoteCard.module.scss';

interface NoteCardProps {
  initialList: Array<{ value: string }>;
}

const NoteCard: React.FC<NoteCardProps> = ({ initialList }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(initialList));
  const { expressions } = state;

  const { updateExpression, deleteExpression } = bindDispatch(
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
    </div>
  );
};

export default NoteCard;
