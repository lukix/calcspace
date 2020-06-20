import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';
import HeaderBar from '../shared/headerBar';

import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import SyncService from '../shared/syncService';
import Spinner from '../shared/spinner';

import styles from './SharedEditor.module.scss';

const syncingStatuses = {
  DIRTY: 'DIRTY',
  STARTED: 'STARTED',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
};

const fetchFileAction = (id) => httpRequest.get(`shared-files/edit/${id}`);

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  const { sharedEditId } = useParams();
  const [fetchFile, file, isFetchingFile, fetchingFileError] = useAsyncAction(fetchFileAction);
  const [syncStatus, setSyncStatus] = useState(syncingStatuses.SYNCED);

  useEffect(() => {
    fetchFile(sharedEditId);
  }, [fetchFile, sharedEditId]);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: (code) => httpRequest.put(`shared-files/edit/${sharedEditId}`, { code }),
      debounceTimeout: 1500,
      onSyncStart: () => setSyncStatus(syncingStatuses.STARTED),
      onSyncSuccess: () => setSyncStatus(syncingStatuses.SYNCED),
      onSyncError: () => setSyncStatus(syncingStatuses.FAILED),
    });
  }, [sharedEditId]);

  const onCodeChange = (value) => {
    setSyncStatus(syncingStatuses.DIRTY);
    syncService.pushChanges(value);
  };

  return (
    <div className={styles.sharedEditorPage}>
      <HeaderBar
        headerTitle={
          <>
            <Link to="/">Math IDE</Link>
            <Spinner
              size={18}
              show={[syncingStatuses.DIRTY, syncingStatuses.STARTED].includes(syncStatus)}
            />
            {syncStatus === syncingStatuses.FAILED && (
              <FaExclamationCircle
                title="Saving changes failed. Make same changes to retry."
                className={styles.errorIcon}
              />
            )}
          </>
        }
        icons={
          <div className={styles.headerLinks}>
            <Link to="/log-in">Log In</Link> / <Link to="/sign-up">Sign Up</Link>
          </div>
        }
      />
      <div className={styles.sharedEditorSectionsWrapper}>
        <div className={styles.editorWrapper}>
          {isFetchingFile && <Spinner centered />}
          {!isFetchingFile && fetchingFileError && <div>Error occured when fetching the file.</div>}
          {!isFetchingFile && !fetchingFileError && (
            <CodeEditor initialCode={file ? file.code : ''} onChange={onCodeChange} />
          )}
        </div>
        <div className={styles.guideWrapper}>
          <UserGuide isSignedIn={false} />
        </div>
      </div>
    </div>
  );
};

export default SharedEditor;
