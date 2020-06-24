import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Switch, Case, Default } from 'react-when-then';
import socketIO from 'socket.io-client';

import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';

import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import SyncService from '../shared/syncService';
import Spinner from '../shared/spinner';

import SharedEditorHeaderBar from './SharedEditorHeaderBar';
import { syncStatuses } from './constants';
import styles from './SharedEditor.module.scss';

const fetchFileAction = (id) => httpRequest.get(`shared-files/edit/${id}`);

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  const { sharedEditId } = useParams();
  const [fetchFile, initialFileCommit, isFetchingFile, fetchingFileError] = useAsyncAction(
    fetchFileAction
  );
  const [syncStatus, setSyncStatus] = useState(syncStatuses.SYNCED);

  useEffect(() => {
    fetchFile(sharedEditId);
  }, [fetchFile, sharedEditId]);

  useEffect(() => {
    const socket = socketIO('http://localhost:3001'); // TODO
    socket.emit('subscribe-to-file', { sharedEditId });
    socket.on('change', (data) => {
      console.log(data);
    });

    return () => socket.disconnect();
  }, [sharedEditId]);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: ({ code, commitId }) =>
        httpRequest.put(`shared-files/edit/${sharedEditId}`, { code, commitId }),
      debounceTimeout: 1500,
      onSyncStart: () => setSyncStatus(syncStatuses.STARTED),
      onSyncSuccess: () => setSyncStatus(syncStatuses.SYNCED),
      onSyncError: () => setSyncStatus(syncStatuses.FAILED),
    });
  }, [sharedEditId]);

  const onCodeChange = (value) => {
    setSyncStatus(syncStatuses.DIRTY);
    syncService.pushChanges({ code: value, commitId: initialFileCommit.commitId });
  };

  return (
    <div className={styles.sharedEditorPage}>
      <SharedEditorHeaderBar syncStatus={syncStatus} />
      <div className={styles.sharedEditorSectionsWrapper}>
        <div className={styles.editorWrapper}>
          <Switch>
            <Case when={isFetchingFile}>
              <Spinner centered />
            </Case>
            <Case when={fetchingFileError}>
              <div>
                Couldn't load the file. It may be due to one of these reasons:
                <ul>
                  <li>The URL is incorrect.</li>
                  <li>The file has been removed due to not being visited for more than 30 days.</li>
                  <li>Some other unexpected error has occured.</li>
                </ul>
              </div>
            </Case>
            <Default>
              <CodeEditor
                initialCode={initialFileCommit ? initialFileCommit.code : ''}
                onChange={onCodeChange}
              />
            </Default>
          </Switch>
        </div>
        <div className={styles.guideWrapper}>
          <UserGuide isSignedIn={false} />
        </div>
      </div>
    </div>
  );
};

export default SharedEditor;
