import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Switch, Case, Default } from 'react-when-then';
import socketIO from 'socket.io-client';
import * as diff from 'diff';

import { SOCKETS_URL } from '../config';
import CodeEditor from '../shared/codeEditor';
import UserGuide from '../shared/userGuide';

import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import SyncService from '../shared/syncService';
import Spinner from '../shared/spinner';

import SharedEditorHeaderBar from './SharedEditorHeaderBar';
import { syncStatuses } from './constants';
import findNewCursorPosition from './findNewCursorPosition';
import styles from './SharedEditor.module.scss';

const fetchFileAction = (id) => httpRequest.get(`shared-files/edit/${id}`);

interface SharedEditorProps {}

const SharedEditor: React.FC<SharedEditorProps> = () => {
  const { sharedEditId } = useParams();
  const [fetchFile, initialFileCommit, isFetchingFile, fetchingFileError] = useAsyncAction(
    fetchFileAction
  );
  const [syncStatus, setSyncStatus] = useState(syncStatuses.SYNCED);
  const [code, setCode] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchFile(sharedEditId);
  }, [fetchFile, sharedEditId]);

  useEffect(() => {
    if (initialFileCommit) {
      setCode(initialFileCommit.code);
    }
  }, [initialFileCommit]);

  const handleSocketChangeMessage = useCallback(
    (data) => {
      if (!textareaRef.current) {
        return;
      }
      const { selectionStart, selectionEnd } = textareaRef.current;
      const diffResult = diff.diffChars(code, data.code);
      const newSelectionStart = findNewCursorPosition(diffResult, selectionStart);
      const newSelectionEnd = findNewCursorPosition(diffResult, selectionEnd);

      setCode(data.code);
      textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
    },
    [code]
  );

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('change', handleSocketChangeMessage);
    return () => socket.off('change');
  }, [socket, handleSocketChangeMessage]);

  useEffect(() => {
    const newSocket = socketIO(SOCKETS_URL);
    newSocket.emit('subscribe-to-file', { sharedEditId });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
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
    setCode(value);
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
              <CodeEditor code={code} onChange={onCodeChange} textareaRef={textareaRef} />
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
