import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FaLink, FaPen, FaEye } from 'react-icons/fa';
import { TiSortNumerically } from 'react-icons/ti';

import HighlightedCode from './HighlightedCode';
import RadioButtons from './radioButtons';
import ToggleButton from './toggleButton';
import { tokenizeCode, tokenizedCodeToString } from './codeTokenizer';
import SharingModal from './SharingModal';
import styles from './CodeEditor.module.scss';

interface CodeEditorProps {
  code: string;
  onChange: Function;
  textareaRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
  viewOnly?: boolean;
  sharedViewId?: string;
  sharedEditId?: string;
  initialSharedViewEnabled?: boolean;
  initialSharedEditEnabled?: boolean;
  fileId?: string;
}

const modes = {
  EDIT_MODE: 'EDIT_MODE',
  VIEW_MODE: 'VIEW_MODE',
};
const getModeOptions = (viewOnly) => [
  { value: modes.EDIT_MODE, label: viewOnly ? 'Rich Mode' : 'Edit Mode', icon: <FaPen /> },
  {
    value: modes.VIEW_MODE,
    label: viewOnly ? 'Raw Mode' : 'View Mode',
    description: `${
      viewOnly ? 'Raw Mode' : 'View Mode'
    } lets you select and copy any fragment of the code - even automatically generated results`,
    icon: <FaEye />,
  },
];

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  textareaRef,
  viewOnly = false,
  sharedViewId,
  sharedEditId,
  initialSharedViewEnabled,
  initialSharedEditEnabled,
  fileId,
}) => {
  const [mode, setMode] = useState(modes.EDIT_MODE);
  const [exponentialNotation, setExponentialNotation] = useState(
    localStorage.getItem('exponentialNotation') === 'true'
  );
  const [showResultUnit, setShowResultUnit] = useState(
    localStorage.getItem('showResultUnit') === 'true'
  );
  const [sharingModalVisible, setSharingModalVisible] = useState(false);
  const showSharingModal = () => setSharingModalVisible(true);
  const hideSharingModal = () => setSharingModalVisible(false);

  const [sharedViewEnabled, setSharedViewEnabled] = useState(Boolean(initialSharedViewEnabled));
  const [sharedEditEnabled, setSharedEditEnabled] = useState(Boolean(initialSharedEditEnabled));
  useEffect(() => setSharedViewEnabled(Boolean(initialSharedViewEnabled)), [
    initialSharedViewEnabled,
  ]);
  useEffect(() => setSharedEditEnabled(Boolean(initialSharedEditEnabled)), [
    initialSharedEditEnabled,
  ]);

  const onCodeChange = (e) => {
    const value = e.target.value;
    onChange(value);
  };

  useEffect(() => {
    localStorage.setItem('exponentialNotation', `${exponentialNotation}`);
  }, [exponentialNotation]);

  useEffect(() => {
    localStorage.setItem('showResultUnit', `${showResultUnit}`);
  }, [showResultUnit]);

  const isInViewMode = mode === modes.VIEW_MODE;

  const evaluatedCode = tokenizeCode(code, {
    exponentialNotation,
    showResultUnit: !isInViewMode || showResultUnit,
  });

  const codeWithResults = tokenizedCodeToString(evaluatedCode);

  const longestLineLength = Math.max(...codeWithResults.split('\n').map((line) => line.length));

  return (
    <div className={styles.codeEditor}>
      <RadioButtons
        className={styles.buttons}
        items={getModeOptions(viewOnly)}
        value={mode}
        onChange={setMode}
      />
      <ToggleButton
        className={styles.buttons}
        label="Exponential notation"
        value={exponentialNotation}
        onChange={setExponentialNotation}
        description={
          exponentialNotation
            ? 'Exponential notation is on. Results greater or equal to 10000 will be displayed using exponential notation (for example 2.5e4 instead of 25000)'
            : 'Exponential notation is off'
        }
        icon={<TiSortNumerically />}
      />
      {isInViewMode && (
        <ToggleButton
          className={styles.buttons}
          label="Show result unit"
          value={showResultUnit}
          onChange={setShowResultUnit}
          description={showResultUnit ? 'Showing result unit is on' : 'Showing result unit is off'}
          icon={<TiSortNumerically />}
        />
      )}
      {(sharedViewId || sharedEditId) && (
        <ToggleButton
          className={styles.buttons}
          label="Sharing"
          value={sharedViewEnabled || sharedEditEnabled}
          onChange={showSharingModal}
          description={showResultUnit ? 'Sharing is on' : 'Sharing is off'}
          icon={<FaLink />}
        />
      )}
      <div className={styles.codeWrapper}>
        <textarea
          className={styles.editorTextarea}
          value={isInViewMode ? codeWithResults : code}
          onChange={onCodeChange}
          ref={textareaRef}
          style={{
            height: `${code.split('\n').length * 1.2}rem`,
            width: `${longestLineLength}ch`,
          }}
          placeholder={isInViewMode || viewOnly ? 'File is empty' : 'Type a math expression...'}
          readOnly={isInViewMode || viewOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <pre
          className={classNames(styles.formattedCode, {
            [styles.withoutHighlighting]: isInViewMode,
          })}
        >
          <HighlightedCode tokenizedLines={evaluatedCode} />
        </pre>
      </div>
      <SharingModal
        visible={sharingModalVisible}
        hide={hideSharingModal}
        sharedViewId={sharedViewId}
        sharedEditId={sharedEditId}
        sharedViewEnabled={sharedViewEnabled}
        sharedEditEnabled={sharedEditEnabled}
        setSharedViewEnabled={setSharedViewEnabled}
        setSharedEditEnabled={setSharedEditEnabled}
        fileId={fileId}
      />
    </div>
  );
};

export default CodeEditor;
