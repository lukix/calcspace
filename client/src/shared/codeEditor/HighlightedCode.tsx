import React, { Fragment } from 'react';
import classNames from 'classnames';
import { tokens as availableTokens } from './codeTokenizer';
import styles from './CodeEditor.module.scss';

const HighlightedLine = ({ tokens }) => {
  return tokens.map(({ value, tags }, index) => {
    const className = classNames({
      [styles.tokenVirtual]: tags.includes(availableTokens.VIRTUAL),
      [styles.tokenComment]: tags.includes(availableTokens.COMMENT),
      [styles.tokenDesiredUnit]: tags.includes(availableTokens.DESIRED_UNIT),
      [styles.tokenError]: tags.includes(availableTokens.ERROR),
      [styles.tokenErrorSource]: tags.includes(availableTokens.ERROR_SOURCE),
    });
    return (
      <span key={index} className={className}>
        {tags.includes(availableTokens.POWER_ALIGN) ? <sup>{value}</sup> : value}
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
