import React from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import { Modal } from '../modal';

import styles from './CodeEditor.module.scss';
import { Mode, MODES } from './copilot/constants';

interface EditorSettingsModalProps {
  visible: boolean;
  hide: Function;
  exponentialNotation: boolean;
  setExponentialNotation: Function;
  showResultUnit: boolean;
  setShowResultUnit: Function;
  copilotMode: Mode,
  setCopilotMode: (cb: (value: Mode) => Mode) => void,
  openAIApiKey: string,
  setOpenAIApiKey: (value: string) => void,
  groqApiKey: string,
  setGroqApiKey: (value: string) => void,
  ollamaUrl: string,
  setOllamaUrl: (value: string) => void,
}

const EditorSettingsModal: React.FC<EditorSettingsModalProps> = ({
  visible,
  hide,
  exponentialNotation,
  setExponentialNotation,
  showResultUnit,
  setShowResultUnit,
  copilotMode,
  setCopilotMode,
  openAIApiKey,
  setOpenAIApiKey,
  groqApiKey,
  setGroqApiKey,
  ollamaUrl,
  setOllamaUrl
}) => {
  const toggleExponentialNotation = () => setExponentialNotation((value) => !value);
  const toggleShowResultUnit = () => setShowResultUnit((value) => !value);

  const toggleOpenAICopilotEnabled = () => setCopilotMode(value => {
    if (value === MODES.OPENAI) {
      return MODES.NONE;
    }
    return MODES.OPENAI;
  });
  const toggleGroqCopilotEnabled = () => setCopilotMode(value => {
    if (value === MODES.GROQ) {
      return MODES.NONE;
    }
    return MODES.GROQ;
  });
  const toggleOllamaCopilotEnabled = () => setCopilotMode(value => {
    if (value === MODES.OLLAMA_CHAT) {
      return MODES.NONE;
    }
    return MODES.OLLAMA_CHAT;
  });

  const updateOpenAIApiKey = (e) => setOpenAIApiKey(e.target.value);
  const updateGroqApiKey = (e) => setGroqApiKey(e.target.value);
  const updateOllamaUrl = (e) => setOllamaUrl(e.target.value);

  const selectAllTextInInput = (e) => e.target.select();

  return (
    <Modal visible={visible} onHide={hide} title="Editor Settings">
      <div>
        <div>
          <label className={styles.modalToggleLabel}>
            <Toggle
              checked={exponentialNotation}
              onChange={toggleExponentialNotation}
              className={styles.modalToggle}
            />
            <span>
              Exponential notation is{' '}
              {exponentialNotation
                ? 'enabled for numbers with absolute value greater than 10000'
                : 'disabled'}
            </span>
          </label>
        </div>
      </div>
      <div className={styles.shareModeContainer}>
        <div>
          <label className={styles.modalToggleLabel}>
            <Toggle
              checked={showResultUnit}
              onChange={toggleShowResultUnit}
              className={styles.modalToggle}
            />
            <span>
              Displaying desired unit part in view mode is {showResultUnit ? 'enabled' : 'disabled'}
            </span>
          </label>
        </div>
      </div>
      <div>
        <h3>Code completion</h3>
      </div>
      <div className={styles.shareModeContainer}>
        <div>
          <label className={styles.modalToggleLabel}>
            <Toggle
              checked={copilotMode === MODES.OPENAI}
              onChange={toggleOpenAICopilotEnabled}
              className={styles.modalToggle}
            />
            <span>
              OpenAI
            </span>
          </label>
          <label className={styles.modalInputLabel}>
            <input
              type="text"
              placeholder="OpenAI API key"
              className={styles.sharedModalUrlBox}
              onFocus={selectAllTextInInput}
              value={openAIApiKey}
              onChange={updateOpenAIApiKey}
            />
          </label>
        </div>
      </div>
      <div className={styles.shareModeContainer}>
        <div>
          <label className={styles.modalToggleLabel}>
            <Toggle
              checked={copilotMode === MODES.GROQ}
              onChange={toggleGroqCopilotEnabled}
              className={styles.modalToggle}
            />
            <span>
              Groq
            </span>
          </label>
          <label className={styles.modalInputLabel}>
            <input
              type="text"
              placeholder="Groq API key"
              className={styles.sharedModalUrlBox}
              onFocus={selectAllTextInInput}
              value={groqApiKey}
              onChange={updateGroqApiKey}
            />
          </label>
        </div>
      </div>
      <div className={styles.shareModeContainer}>
        <div>
          <label className={styles.modalToggleLabel}>
            <Toggle
              checked={copilotMode === MODES.OLLAMA_CHAT}
              onChange={toggleOllamaCopilotEnabled}
              className={styles.modalToggle}
            />
            <span>
              Ollama
            </span>
          </label>
          <label className={styles.modalInputLabel}>
            <input
              type="text"
              placeholder="Ollama URL (e.g. http://localhost:11434/api without trailing slash)"
              className={styles.sharedModalUrlBox}
              onFocus={selectAllTextInInput}
              value={ollamaUrl}
              onChange={updateOllamaUrl}
            />
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default EditorSettingsModal;
