import React from 'react';
import classNames from 'classnames';

import TokenBlock from './TokenBlock';

import styles from './AnalyzerPage.module.scss';

interface PrecedenceHierarchyProps {
  result: any;
  error: any;
}

const PrecedenceHierarchy: React.FC<PrecedenceHierarchyProps> = ({ result, error }) => (
  <div className={styles.stepResultContainer}>
    {error
      ? `${error}`
      : result.map((productElements, i) => (
          <div key={i} className={classNames(styles.hierarchyElement, styles.sumElement)}>
            {productElements.map((powerElements, j) => (
              <div
                key={`${i}-${j}`}
                className={classNames(styles.hierarchyElement, styles.productElement)}
              >
                {powerElements.map((token, k) => (
                  <div
                    key={`${i}-${j}-${k}`}
                    className={classNames(styles.hierarchyElement, styles.powerElement)}
                  >
                    <TokenBlock
                      key={`${i}-${j}-${k}`}
                      id={`${i}-${j}-${k}`}
                      token={token}
                      expandFunctionsRecursively={false}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
  </div>
);

export default PrecedenceHierarchy;
