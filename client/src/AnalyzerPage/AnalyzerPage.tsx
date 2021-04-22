import React, { useState, useMemo } from 'react';

import TokenBlock from './TokenBlock';
import PrecedenceHierarchy from './PrecedenceHierarchy';
import analyzeExpression from './analyzeExpression';

import styles from './AnalyzerPage.module.scss';

interface AnalyzerPageProps {}

const AnalyzerPage: React.FC<AnalyzerPageProps> = () => {
  const [expression, setExpression] = useState('x+50m/s * c^2 - f(0.1+2e-1)');
  const changeExpression = (event) => {
    setExpression(event.target.value);
  };

  const { tokenResults, precedenceHierarchy } = useMemo(() => {
    return analyzeExpression(expression);
  }, [expression]);

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>CalcSpace.com - Parsing Engine Analyzer (for developers)</h1>
      </header>
      <div className={styles.mainContainer}>
        <input
          type="text"
          className={styles.expressionInput}
          value={expression}
          onChange={changeExpression}
          placeholder="Type an expression to analyze..."
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        {tokenResults.map(({ stepName, result, error }, stepIndex) => (
          <div key={stepIndex} className={styles.stepContainer}>
            <h2>{stepName}</h2>
            {error ? (
              `${error}`
            ) : (
              <div className={styles.stepResultContainer}>
                {result.map((token, blockIndex) => (
                  <TokenBlock
                    key={`${stepIndex}-${blockIndex}`}
                    id={`${stepIndex}-${blockIndex}`}
                    token={token}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <h2>{precedenceHierarchy.stepName}</h2>
        <PrecedenceHierarchy
          result={precedenceHierarchy.result}
          error={precedenceHierarchy.error}
        />
      </div>
    </div>
  );
};

export default AnalyzerPage;
