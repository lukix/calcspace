import React from 'react';
import { Link } from 'react-router-dom';

import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';
import HeaderBar from '../shared/headerBar';

import styles from './SharedEditor.module.scss';

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  return (
    <div className={styles.sharedEditorPage}>
      <HeaderBar
        headerTitle="Math IDE"
        icons={
          <div className={styles.headerLinks}>
            <Link to="/log-in">Log In</Link> / <Link to="/sign-up">Sign Up</Link>
          </div>
        }
      />
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
