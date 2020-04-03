import React, { Fragment } from 'react';
import classNames from 'classnames';
import evaluateCode, { tokens as availableTokens } from './evaluateCode';
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

interface CodeEditorProps {
  code: string;
  updateCode: Function;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, updateCode }) => {
  const onCodeChange = e => {
    updateCode(e.target.value);
  };

  const evaluatedCode = evaluateCode(code);

  return (
    <div className={styles.codeEditor}>
      <div className={styles.codeWrapper}>
        <textarea
          className={styles.editorTextarea}
          value={code}
          onChange={onCodeChange}
          style={{ height: `${code.split('\n').length * 1.2}rem` }}
          placeholder="Type a math expression..."
        />
        <pre className={styles.formattedCode}>
          <HighlightedCode tokenizedLines={evaluatedCode} />
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
