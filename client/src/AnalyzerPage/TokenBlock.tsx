import React, { Fragment } from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import styles from './AnalyzerPage.module.scss';

const getDisplayValue = (token, expandFunctionsRecursively = true) => {
  if (token.type === 'FUNCTION') {
    if (!token.name) {
      return '';
    }
    const argsDisplayValues = expandFunctionsRecursively
      ? token.arguments.map((tokensArray) => tokensArray.map((t) => getDisplayValue(t)).join(''))
      : token.arguments.map(() => '...');
    return `${token.name}(${argsDisplayValues.join(', ')})`;
  }
  if (typeof token.value === 'object') {
    if (!Array.isArray(token.value)) {
      return '{}';
    }
    if (!expandFunctionsRecursively) {
      return '(...)';
    }
    return token.value.map((t) => getDisplayValue(t)).join('');
  }
  return `${token.value || ''}`;
};

interface TokenBlockProps {
  id?: string;
  token: any;
  expandFunctionsRecursively?: boolean;
  showTooltip?: boolean;
}

const TokenBlock: React.FC<TokenBlockProps> = ({
  id,
  token,
  expandFunctionsRecursively = true,
  showTooltip = true,
}) => (
  <Fragment>
    {showTooltip && (
      <ReactTooltip effect="solid" id={`tooltip-${id}`}>
        <pre>{JSON.stringify(token, null, 2)}</pre>
      </ReactTooltip>
    )}
    <div
      className={classNames(
        styles.block,
        `type_${token.type}`,
        `symbolType_${token.symbolType || 'DEFAULT'}`
      )}
      data-tip
      data-for={`tooltip-${id}`}
    >
      {getDisplayValue(token, expandFunctionsRecursively)}
    </div>
  </Fragment>
);

export default TokenBlock;
