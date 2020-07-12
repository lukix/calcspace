import React from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import { Modal } from '../modal';

import styles from './CodeEditor.module.scss';

interface EditorSettingsModalProps {
  visible: boolean;
  hide: Function;
  exponentialNotation: boolean;
  setExponentialNotation: Function;
  showResultUnit: boolean;
  setShowResultUnit: Function;
}

const EditorSettingsModal: React.FC<EditorSettingsModalProps> = ({
  visible,
  hide,
  exponentialNotation,
  setExponentialNotation,
  showResultUnit,
  setShowResultUnit,
}) => {
  const toggleExponentialNotation = () => setExponentialNotation((value) => !value);
  const toggleShowResultUnit = () => setShowResultUnit((value) => !value);

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
    </Modal>
  );
};

export default EditorSettingsModal;
