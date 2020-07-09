import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import CodeEditor from '../shared/codeEditor';

import httpRequest from '../shared/httpRequest';
import SyncService, { requestLimiterMethods } from '../shared/syncService';

import { syncStatuses } from './constants';
import useSharedFileChangeListener from '../shared/sharedFilesUtils/useSharedFileChangeListener';

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useSharedFileChangeListener({
    socketSubscribePath: viewOnly ? 'subscribe-to-file/by-view-id' : 'subscribe-to-file/by-edit-id',
    id,
    commit,
    code,
    textareaRef,
    changeHandler: useCallback(({ data, newCode, newSelectionStart, newSelectionEnd }) => {
      setCode(newCode);
      setCommit({ commitId: data.commitId, code: data.code });
      textareaRef.current?.setSelectionRange(newSelectionStart, newSelectionEnd);
    }, []),
  });

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

  return (
    <CodeEditor code={code} onChange={setCode} textareaRef={textareaRef} viewOnly={viewOnly} />
  );
};

export default SharedEditor;
