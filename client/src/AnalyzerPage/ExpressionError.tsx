import React from 'react';

import styles from './AnalyzerPage.module.scss';

interface ExpressionErrorProps {
  expression: string;
  error: any;
}

const ExpressionError: React.FC<ExpressionErrorProps> = ({ expression, error }) => {
  if (error.isParserError) {
    const startCharIndex = error.startCharIndex || 0;
    const endCharIndex = error.endCharIndex || expression.length;

    const firstPart = expression.slice(0, startCharIndex);
    const errorPart = expression.slice(startCharIndex, endCharIndex);
    const lastPart = expression.slice(endCharIndex);

    return (
      <>
        <pre className={styles.expressionError}>{`${error}`}</pre>
        <pre className={styles.expressionError}>
          {firstPart}
          <span className={styles.invalidPart}>{errorPart}</span>
          {lastPart}
        </pre>
      </>
    );
  }
  return <pre className={styles.expressionError}>{`${error}`}</pre>;
};

export default ExpressionError;
