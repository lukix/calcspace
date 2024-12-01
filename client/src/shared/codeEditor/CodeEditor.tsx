import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { FaLink, FaPen, FaEye, FaRegCopy } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

import httpRequest from '../../shared/httpRequest';
import useCreateAndOpenSharedFile from '../../shared/useCreateAndOpenSharedFile';
import HighlightedCode from './HighlightedCode';
import RadioButtons from './radioButtons';
import ToggleButton from './toggleButton';
import { CodeTokenizer, tokenizedCodeToString, tokens } from './codeTokenizer';
import SharingModal from './SharingModal';
import EditorSettingsModal from './EditorSettingsModal';
import styles from './CodeEditor.module.scss';
import { useCopilot } from './copilot/useCopilot';
import { MODES } from './copilot/constants';
import { useCopilotOptions } from './copilot/useCopilotOptions';

const createSharedFileAction = ({ code }) => httpRequest.post(`shared-files`, { code });

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  signedInView: boolean;
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
  {
    value: modes.EDIT_MODE,
    label: viewOnly ? 'Rich Mode' : 'Edit Mode',
    description: viewOnly ? 'Rich Mode' : 'Edit Mode',
    icon: <FaPen />,
  },
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
  signedInView,
  textareaRef,
  viewOnly = false,
  sharedViewId,
  sharedEditId,
  initialSharedViewEnabled,
  initialSharedEditEnabled,
  fileId,
}) => {
  const tokenizeCode = useMemo(() => CodeTokenizer(), []);

  const [mode, setMode] = useState(modes.EDIT_MODE);

  const {
    copilotMode,
    setCopilotMode,
    openAIApiKey,
    setOpenAIApiKey,
    groqApiKey,
    setGroqApiKey,
    ollamaUrl,
    setOllamaUrl,
  } = useCopilotOptions();

  const [exponentialNotation, setExponentialNotation] = useState(
    localStorage.getItem('exponentialNotation') === 'true'
  );
  const [showResultUnit, setShowResultUnit] = useState(
    localStorage.getItem('showResultUnit') === 'true'
  );

  const {
    createSharedFile: createFileCopy,
    isCreatingSharedFile: isCreatingFileCopy,
  } = useCreateAndOpenSharedFile(createSharedFileAction, { openInNewTab: true });

  useEffect(() => {
    localStorage.setItem('exponentialNotation', `${exponentialNotation}`);
  }, [exponentialNotation]);

  useEffect(() => {
    localStorage.setItem('showResultUnit', `${showResultUnit}`);
  }, [showResultUnit]);

  const [sharingModalVisible, setSharingModalVisible] = useState(false);
  const showSharingModal = () => setSharingModalVisible(true);
  const hideSharingModal = () => setSharingModalVisible(false);

  const [editorSettingsModalVisible, setEditorSettingsModalVisible] = useState(false);
  const showEditorSettingsModal = () => setEditorSettingsModalVisible(true);
  const hideEditorSettingsModal = () => setEditorSettingsModalVisible(false);

  const [sharedViewEnabled, setSharedViewEnabled] = useState(Boolean(initialSharedViewEnabled));
  const [sharedEditEnabled, setSharedEditEnabled] = useState(Boolean(initialSharedEditEnabled));
  useEffect(() => setSharedViewEnabled(Boolean(initialSharedViewEnabled)), [
    initialSharedViewEnabled,
  ]);
  useEffect(() => setSharedEditEnabled(Boolean(initialSharedEditEnabled)), [
    initialSharedEditEnabled,
  ]);

  const isInViewMode = mode === modes.VIEW_MODE;

  const evaluatedCode = tokenizeCode(code, {
    exponentialNotation,
    showResultUnit: !isInViewMode || showResultUnit,
  });

  const [enabledCompletion, setEnabledCompletion] = useState(false);
  const [completion, onAccept] = useCopilot({
    code,
    enable: enabledCompletion && !isInViewMode && copilotMode !== MODES.NONE,
    onChange,
    mode: copilotMode,
    openAIApiKey,
    groqApiKey,
    ollamaUrl,
  });

  const evaluatedCodeWithCompletion = evaluatedCode.map((line, index) => {
    if (index === evaluatedCode.length - 1) {
      const index = line.findIndex(({ tags }) => tags.includes(tokens.VIRTUAL));
      line.splice(index < 0 ? line.length : index, 0, {
        value: completion,
        tags: [tokens.VIRTUAL, 'COMPLETION'],
      });
    }
    return line;
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      onAccept();
    }
    if (e.key === 'Escape') {
      setEnabledCompletion(false);
    }
  }

  const onCodeChange = (e) => {
    const value = e.target.value;
    if (value !== code) {
      setEnabledCompletion(true);
    }
    onChange(value);
  };

  const codeWithResults = tokenizedCodeToString(evaluatedCodeWithCompletion);

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
        label="Settings"
        value={false}
        onChange={showEditorSettingsModal}
        description="Click to open editor settings"
        icon={<MdSettings />}
      />
      <ToggleButton
        className={styles.buttons}
        label="Sharing"
        value={sharedViewEnabled || sharedEditEnabled}
        onChange={showSharingModal}
        description="Click to open sharing options"
        icon={<FaLink />}
      />
      {!signedInView && (
        <ToggleButton
          className={styles.buttons}
          label={
            isCreatingFileCopy ? 'Creating copy...' : `Create ${viewOnly ? 'Editable' : 'a'} Copy`
          }
          value={false}
          onChange={() => createFileCopy({ code })}
          description="Click to create editable copy"
          icon={<FaRegCopy />}
          disabled={isCreatingFileCopy}
        />
      )}
      <div className={styles.codeWrapper}>
        {!isInViewMode && (
          <textarea
            className={styles.editorTextarea}
            value={code}
            onChange={onCodeChange}
            ref={textareaRef}
            style={{
              height: `${code.split('\n').length * 1.25}rem`,
              width: `${longestLineLength}ch`,
            }}
            placeholder={viewOnly ? 'File is empty' : 'Type a math expression...'}
            readOnly={viewOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            onKeyDown={handleKeyDown}
          />
        )}
        <pre
          className={classNames(styles.formattedCode, {
            [styles.withoutHighlighting]: isInViewMode,
          })}
        >
          <HighlightedCode tokenizedLines={evaluatedCodeWithCompletion} />
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
        signedInView={signedInView}
      />
      <EditorSettingsModal
        visible={editorSettingsModalVisible}
        hide={hideEditorSettingsModal}
        exponentialNotation={exponentialNotation}
        setExponentialNotation={setExponentialNotation}
        showResultUnit={showResultUnit}
        setShowResultUnit={setShowResultUnit}
        copilotMode={copilotMode}
        setCopilotMode={setCopilotMode}
        openAIApiKey={openAIApiKey}
        setOpenAIApiKey={setOpenAIApiKey}
        groqApiKey={groqApiKey}
        setGroqApiKey={setGroqApiKey}
        ollamaUrl={ollamaUrl}
        setOllamaUrl={setOllamaUrl}
      />
    </div>
  );
};

export default CodeEditor;
