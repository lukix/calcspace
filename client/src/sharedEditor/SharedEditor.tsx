import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import socketIO from 'socket.io-client';
import * as diff from 'diff';

import { SOCKETS_URL } from '../config';
import CodeEditor from '../shared/codeEditor';

import httpRequest from '../shared/httpRequest';
import SyncService, { requestLimiterMethods } from '../shared/syncService';

import { syncStatuses } from './constants';
import findNewCursorPosition from './findNewCursorPosition';
import mergeChanges from './mergeChanges';

interface SharedEditorProps {
  id: string;
  viewOnly: boolean;
  setSyncStatus: Function;
  initialFileCommit: { commitId: string; code: string };
}

const SharedEditor: React.FC<SharedEditorProps> = ({
  id,
  viewOnly,
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
        httpRequest.put(`shared-files/edit/${id}`, { code, commitId }),
      requestLimiterTimeout: 600,
      requestLimiterMethod: requestLimiterMethods.THROTTLE,
      onSyncStart: () => setSyncStatus(syncStatuses.STARTED),
      onSyncSuccess: () => setSyncStatus(syncStatuses.SYNCED),
      onSyncError: () => setSyncStatus(syncStatuses.FAILED),
    });
  }, [setSyncStatus, id]);

  useEffect(() => {
    if (commit && !viewOnly) {
      setSyncStatus(syncStatuses.DIRTY);
      syncService.pushChanges({ code, commitId: commit.commitId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, viewOnly, syncService]);

  const handleSocketChangeMessage = useCallback(
    (data) => {
      if (!textareaRef.current) {
        return;
      }

      const newCode = viewOnly ? data.code : mergeChanges(commit.code, code, data.code);
      const { selectionStart, selectionEnd } = textareaRef.current;
      const diffResult = diff.diffChars(code, newCode);
      const newSelectionStart = findNewCursorPosition(diffResult, selectionStart);
      const newSelectionEnd = findNewCursorPosition(diffResult, selectionEnd);

      setCode(newCode);
      setCommit({ commitId: data.commitId, code: data.code });

      textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
    },
    [commit, code, viewOnly]
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
    newSocket.emit(viewOnly ? 'subscribe-to-file/by-view-id' : 'subscribe-to-file/by-edit-id', {
      id,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [id, viewOnly]);

  return (
    <CodeEditor code={code} onChange={setCode} textareaRef={textareaRef} viewOnly={viewOnly} />
  );
};

export default SharedEditor;
