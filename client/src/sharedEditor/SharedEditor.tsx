import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import socketIO from 'socket.io-client';
import * as diff from 'diff';

import { SOCKETS_URL } from '../config';
import CodeEditor from '../shared/codeEditor';

import httpRequest from '../shared/httpRequest';
import SyncService from '../shared/syncService';

import { syncStatuses } from './constants';
import findNewCursorPosition from './findNewCursorPosition';
import mergeChanges from './mergeChanges';

interface SharedEditorProps {
  sharedEditId: string;
  setSyncStatus: Function;
  initialFileCommit: { commitId: string; code: string };
}

const SharedEditor: React.FC<SharedEditorProps> = ({
  sharedEditId,
  setSyncStatus,
  initialFileCommit,
}) => {
  const [code, setCode] = useState(initialFileCommit.code);
  const [commit, setCommit] = useState({
    commitId: initialFileCommit.commitId,
    code: initialFileCommit.code,
  });
  const [socket, setSocket] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: ({ code, commitId }) =>
        httpRequest.put(`shared-files/edit/${sharedEditId}`, { code, commitId }),
      debounceTimeout: 1500,
      onSyncStart: () => setSyncStatus(syncStatuses.STARTED),
      onSyncSuccess: () => setSyncStatus(syncStatuses.SYNCED),
      onSyncError: () => setSyncStatus(syncStatuses.FAILED),
    });
  }, [setSyncStatus, sharedEditId]);

  useEffect(() => {
    if (commit) {
      setSyncStatus(syncStatuses.DIRTY);
      syncService.pushChanges({ code, commitId: commit.commitId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, syncService]);

  const handleSocketChangeMessage = useCallback(
    (data) => {
      if (!textareaRef.current) {
        return;
      }

      const newCode = mergeChanges(commit.code, code, data.code);
      const { selectionStart, selectionEnd } = textareaRef.current;
      const diffResult = diff.diffChars(code, newCode);
      const newSelectionStart = findNewCursorPosition(diffResult, selectionStart);
      const newSelectionEnd = findNewCursorPosition(diffResult, selectionEnd);

      setCode(newCode);
      setCommit({ commitId: data.commitId, code: data.code });

      textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
    },
    [commit, code]
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

  return <CodeEditor code={code} onChange={setCode} textareaRef={textareaRef} />;
};

export default SharedEditor;
