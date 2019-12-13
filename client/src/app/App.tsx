import React, { useState } from 'react';

import styles from './App.module.scss';
import MathExpression from '../mathExpression/MathExpression';

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
      <div>
        {expressions.map((expression, index) => (
          <MathExpression
            key={index}
            value={expression}
            onValueChange={newValue => updateExpression(index, newValue)}
          />
        ))}
        <div onClick={addNewExpression}>Add new line</div>
      </div>
    </div>
  );
};

export default App;
