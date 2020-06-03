import React from 'react';
import styles from './SharedEditor.module.scss';

import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  return (
    <div className={styles.sharedEditor}>
      <div className={styles.editorWrapper}>
        <CodeEditor initialCode="2 + 2" onChange={() => {}} />
      </div>
      <div className={styles.guideWrapper}>
        <UserGuide isSignedIn={false} />
      </div>
    </div>
  );
};

export default SharedEditor;
