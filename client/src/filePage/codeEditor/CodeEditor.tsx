import React, { useState } from 'react';
import evaluateCode from './evaluateCode';
import HighlightedCode from './HighlightedCode';
import styles from './CodeEditor.module.scss';

interface CodeEditorProps {
  initialCode: string;
  onChange: Function;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onChange }) => {
  const [code, setCode] = useState(initialCode);

  const onCodeChange = e => {
    const value = e.target.value;
    setCode(value);
    onChange(value);
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
