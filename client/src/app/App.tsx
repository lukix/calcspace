import React, { useState } from 'react';
import MathExpression from '../mathExpression/MathExpression';
import styles from './App.module.scss';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [expressions, setExpressions] = useState<Array<string>>([]);
  const addNewExpression = () =>
    setExpressions(expressions => [...expressions, '']);
  const updateExpression = (index, newValue) =>
    setExpressions(expressions =>
      expressions.map((expression, i) => (i === index ? newValue : expression))
    );

  return (
    <div className={styles.app}>
      <div className={styles.headerBar}>Math Notes</div>
      <div className={styles.card}>
        {expressions.map((expression, index) => (
          <MathExpression
            key={index}
            value={expression}
            onValueChange={newValue => updateExpression(index, newValue)}
          />
        ))}
        <button
          className={styles.addExpressionButton}
          onClick={addNewExpression}
        >
          Add new line
        </button>
      </div>
    </div>
  );
};

export default App;
