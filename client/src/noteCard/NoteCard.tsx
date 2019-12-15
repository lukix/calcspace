import React, { useState } from 'react';
import MathExpression from '../mathExpression/MathExpression';
import styles from './NoteCard.module.scss';

const initialExpressions = [''];

interface NoteCardProps {}

const NoteCard: React.FC<NoteCardProps> = () => {
  const [expressions, setExpressions] = useState<Array<string>>(
    initialExpressions
  );
  const addNewExpression = () =>
    setExpressions(expressions => [...expressions, '']);
  const updateExpression = (index, newValue) =>
    setExpressions(expressions =>
      expressions.map((expression, i) => (i === index ? newValue : expression))
    );
  const deleteExpression = index =>
    setExpressions(expressions =>
      expressions.filter((expression, i) => i !== index)
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
      <button className={styles.addExpressionButton} onClick={addNewExpression}>
        Add new line
      </button>
    </div>
  );
};

export default NoteCard;
