import React, { Fragment } from 'react';
import classNames from 'classnames';
import { tokens as availableTokens } from './evaluateCode';
import styles from './CodeEditor.module.scss';

const HighlightedLine = ({ tokens }) => {
  return tokens.map(({ value, tags }, index) => {
    const className = classNames({
      [styles.tokenVirtual]: tags.includes(availableTokens.VIRTUAL),
      [styles.tokenError]: tags.includes(availableTokens.ERROR),
    });
    return (
      <span key={index} className={className}>
        {value}
      </span>
    );
  });
};

const HighlightedCode = ({ tokenizedLines }) => {
  return tokenizedLines.map((tokens, index) => (
    <Fragment key={index}>
      <HighlightedLine tokens={tokens} />
      <br />
    </Fragment>
  ));
};

export default HighlightedCode;
