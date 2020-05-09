import React, { useState } from 'react';
import classNames from 'classnames';
import HighlightedCode from './HighlightedCode';
import RadioButtons from './radioButtons/RadioButtons';
import { evaluateCode, evaluatedCodeToString } from './codeTokenizer';
import styles from './CodeEditor.module.scss';

interface CodeEditorProps {
  initialCode: string;
  onChange: Function;
}

const modes = {
  EDIT_MODE: 'EDIT_MODE',
  VIEW_MODE: 'VIEW_MODE',
};
const modeOptions = [
  { value: modes.EDIT_MODE, label: 'Edit Mode' },
  {
    value: modes.VIEW_MODE,
    label: 'View Mode',
    description:
      'View Mode lets you select and copy any fragment of the code - even automatically generated results',
  },
];

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onChange }) => {
  const [mode, setMode] = useState(modes.EDIT_MODE);
  const [code, setCode] = useState(initialCode);

  const onCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    onChange(value);
  };

  const evaluatedCode = evaluateCode(code);

  const isInViewMode = mode === modes.VIEW_MODE;
  const codeWithResults = evaluatedCodeToString(evaluatedCode);

  const longestLineLength = Math.max(...codeWithResults.split('\n').map((line) => line.length));

  return (
    <div className={styles.codeEditor}>
      <RadioButtons
        className={styles.radioButtons}
        items={modeOptions}
        value={mode}
        onChange={setMode}
      />
      <div className={styles.codeWrapper}>
        <textarea
          className={styles.editorTextarea}
          value={isInViewMode ? codeWithResults : code}
          onChange={onCodeChange}
          style={{
            height: `${code.split('\n').length * 1.2}rem`,
            width: `${longestLineLength}ch`,
          }}
          placeholder={isInViewMode ? 'File is empty' : 'Type a math expression...'}
          readOnly={isInViewMode}
        />
        <pre
          className={classNames(styles.formattedCode, {
            [styles.withoutHighlighting]: isInViewMode,
          })}
        >
          <HighlightedCode tokenizedLines={evaluatedCode} />
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
