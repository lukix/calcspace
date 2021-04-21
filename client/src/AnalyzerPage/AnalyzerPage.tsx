import React, { Fragment, useState, useMemo } from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import parseToPrimaryTokens from '../shared/codeEditor/mathParser/parseSteps/parseToPrimaryTokens';
import classifySymbols from '../shared/codeEditor/mathParser/parseSteps/classifySymbols';
import buildComplexUnits from '../shared/codeEditor/mathParser/parseSteps/buildComplexUnits';
import buildSymbolsWithExponentialNotation from '../shared/codeEditor/mathParser/parseSteps/buildSymbolsWithExponentialNotation';
import removeSpaceTokens from '../shared/codeEditor/mathParser/parseSteps/removeSpaceTokens';
import buildSubexpressions from '../shared/codeEditor/mathParser/parseSteps/buildSubexpressions';
import buildFunctions from '../shared/codeEditor/mathParser/parseSteps/buildFunctions';
import validateTokensList from '../shared/codeEditor/mathParser/parseSteps/validateTokensList';

import styles from './AnalyzerPage.module.scss';

const getDisplayValue = (token) => {
  if (token.type === 'FUNCTION') {
    const argsDisplayValues = token.arguments.map((tokensArray) =>
      tokensArray.map((t) => getDisplayValue(t)).join('')
    );
    return `${token.name}(${argsDisplayValues.join(', ')})`;
  }
  if (typeof token.value === 'object') {
    if (!Array.isArray(token.value)) {
      return '{}';
    }
    return token.value.map((t) => getDisplayValue(t)).join('');
  }
  return `${token.value || ''}`;
};

interface AnalyzerPageProps {}

const AnalyzerPage: React.FC<AnalyzerPageProps> = () => {
  const [expression, setExpression] = useState('x+50m/s * c - f(0.1+2e-1)');
  const changeExpression = (event) => {
    console.log(event.target.value);
    setExpression(event.target.value);
  };

  const results = useMemo(() => {
    const steps = [
      parseToPrimaryTokens,
      classifySymbols,
      buildComplexUnits,
      buildSymbolsWithExponentialNotation,
      removeSpaceTokens,
      buildSubexpressions,
      buildFunctions,
      validateTokensList,
    ];

    const initialReducerValue: {
      latestResult: any;
      results: { stepName: string; result: any[]; error: any }[];
      failed: boolean;
    } = {
      latestResult: expression,
      results: [],
      failed: false,
    };

    const { results } = steps.reduce((acc, currentFunction) => {
      if (acc.failed) {
        return {
          ...acc,
          results: [
            ...acc.results,
            {
              stepName: currentFunction.name,
              result: [],
              error: 'Skipped due to an error in one of the previous steps',
            },
          ],
        };
      }
      try {
        const newResult = currentFunction(acc.latestResult);
        return {
          ...acc,
          latestResult: newResult,
          results: [
            ...acc.results,
            { stepName: currentFunction.name, result: newResult, error: null },
          ],
        };
      } catch (error) {
        return {
          ...acc,
          results: [...acc.results, { stepName: currentFunction.name, result: [], error }],
          failed: true,
        };
      }
    }, initialReducerValue);

    console.log(results);

    return results;
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
        {results.map(({ stepName, result, error }, stepIndex) => (
          <div key={stepIndex} className={styles.stepContainer}>
            <h2>{stepName}</h2>
            {error ? (
              `${error}`
            ) : (
              <div className={styles.stepResultContainer}>
                {result.map((token, blockIndex) => (
                  <Fragment key={`${stepIndex}-${blockIndex}`}>
                    <div
                      className={classNames(
                        styles.block,
                        `type_${token.type}`,
                        `symbolType_${token.symbolType || 'DEFAULT'}`
                      )}
                      data-tip
                      data-for={`tooltip-${stepIndex}-${blockIndex}`}
                    >
                      {getDisplayValue(token)}
                    </div>
                    <ReactTooltip effect="solid" id={`tooltip-${stepIndex}-${blockIndex}`}>
                      <pre>{JSON.stringify(token, null, 2)}</pre>
                    </ReactTooltip>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzerPage;
