import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { FaInfoCircle, FaGithub } from 'react-icons/fa';

import TokenBlock from './TokenBlock';
import StepDetailsModal from './StepDetailsModal';
import PrecedenceHierarchy from './PrecedenceHierarchy';
import ExpressionError from './ExpressionError';
import analyzeExpression from './analyzeExpression';

import styles from './AnalyzerPage.module.scss';

const defaultExpressionValue = 'x+50m/s * c^2 - f(0.1+2e-1)';

const useDebouncedState = (defaultState, delay) => {
  const [state, setState] = useState(defaultState);
  const debouncedSetState = useMemo(() => debounce(setState, delay), [delay]);
  return [state, debouncedSetState];
};

interface AnalyzerPageProps {}

const AnalyzerPage: React.FC<AnalyzerPageProps> = () => {
  const [currentModalStep, setCurrentModalStep] = useState(null);
  const openStepDetailsModal = (stepIndex) => setCurrentModalStep(stepIndex);
  const hideStepDetailsModal = () => setCurrentModalStep(null);

  const [expression, setExpression] = useDebouncedState(defaultExpressionValue, 200);
  const [expressionInputValue, setExpressionInputValue] = useState(defaultExpressionValue);

  const changeExpression = (event) => {
    setExpressionInputValue(event.target.value);
    setExpression(event.target.value);
  };

  const { tokenResults, precedenceHierarchy } = useMemo(() => {
    return analyzeExpression(expression);
  }, [expression]);

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>
          <Link to="/">CalcSpace.com</Link> | Parsing Engine Analyzer (for developers)
        </h1>
        <a
          href="https://github.com/lukix/calcspace"
          className={styles.githubLink}
          title="Calcspace on Github"
        >
          <FaGithub />
        </a>
      </header>
      <div className={styles.mainContainer}>
        <input
          type="text"
          className={styles.expressionInput}
          value={expressionInputValue}
          onChange={changeExpression}
          placeholder="Type an expression to analyze..."
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        {tokenResults.map(({ stepName, result, error }, stepIndex) => (
          <div key={stepIndex} className={styles.stepContainer}>
            <h2>
              {stepIndex + 1}. {stepName}{' '}
              <FaInfoCircle
                className={styles.stepDetailsIcon}
                title="Show details"
                onClick={() => openStepDetailsModal(stepIndex)}
              />
            </h2>
            {error ? (
              <ExpressionError expression={expression} error={error} />
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
        <h2>
          {tokenResults.length + 1}. {precedenceHierarchy.stepName}
          <FaInfoCircle
            className={styles.stepDetailsIcon}
            title="Show details"
            onClick={() => openStepDetailsModal(tokenResults.length)}
          />
        </h2>
        <PrecedenceHierarchy
          result={precedenceHierarchy.result}
          error={precedenceHierarchy.error}
        />
      </div>
      <StepDetailsModal
        onHide={() => hideStepDetailsModal()}
        stepResults={[...tokenResults, precedenceHierarchy]}
        currentModalStep={currentModalStep}
      />
    </div>
  );
};

export default AnalyzerPage;
