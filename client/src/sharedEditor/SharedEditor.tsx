import React from 'react';
import styles from './SharedEditor.module.scss';

import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';
import HeaderBar from '../shared/headerBar';

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  return (
    <div className={styles.sharedEditorPage}>
      <HeaderBar headerTitle={'Math IDE'} />
      <div className={styles.sharedEditorSectionsWrapper}>
        <div className={styles.editorWrapper}>
          <CodeEditor initialCode="2 + 2" onChange={() => {}} />
        </div>
        <div className={styles.guideWrapper}>
          <UserGuide isSignedIn={false} />
        </div>
      </div>
    </div>
  );
};

export default SharedEditor;
