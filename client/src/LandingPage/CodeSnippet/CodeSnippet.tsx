import React, { useMemo } from 'react';
import classNames from 'classnames';
import { CodeTokenizerWithCache, HighlightedCode, codeEditorStyles } from '../../shared/codeEditor';
import styles from './CodeSnippet.module.scss';

interface CodeSnippetProps {
  code: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code }) => {
  const tokenizeCode = useMemo(() => CodeTokenizerWithCache(), []);

  const sanitizedCode = code
    .split('\n')
    .map((s) => s.trim())
    .join('\n');

  const evaluatedCode = tokenizeCode(sanitizedCode, {
    exponentialNotation: false,
    showResultUnit: true,
  });

  return (
    <pre className={classNames(styles.codeSnippet, codeEditorStyles.formattedCode)}>
      <HighlightedCode tokenizedLines={evaluatedCode} />
    </pre>
  );
};

export default CodeSnippet;
