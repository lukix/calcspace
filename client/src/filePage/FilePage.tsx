import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import { actions } from '../shared/filesStore';
import Spinner from '../shared/spinner';
import CodeEditor from '../shared/codeEditor';
import SyncService, { requestLimiterMethods } from '../shared/syncService';
import useSharedFileChangeListener from '../shared/sharedFilesUtils/useSharedFileChangeListener';
import sharedStyles from '../shared/shared.module.scss';

interface FilePageProps {
  dirtyFile: Function;
  markSyncingStart: Function;
  markSyncingSuccess: Function;
  markSyncingFailure: Function;
}

const fetchFileAction = (id) => httpRequest.get(`files/${id}`);

const FilePage: React.FC<FilePageProps> = ({
  dirtyFile,
  markSyncingStart,
  markSyncingSuccess,
  markSyncingFailure,
}) => {
  const { fileId } = useParams();
  const [fetchFile, file, isFetchingFile, fetchingFileError] = useAsyncAction(fetchFileAction);
  const [code, setCode] = useState('');
  const [commit, setCommit] = useState({
    commitId: null,
    code: '',
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useSharedFileChangeListener({
    socketSubscribePath: 'subscribe-to-file/by-main-id',
    id: fileId,
    commit,
    code,
    textareaRef,
    changeHandler: useCallback(({ data, newCode, newSelectionStart, newSelectionEnd }) => {
      setCode(newCode);
      setCommit({ commitId: data.commitId, code: data.code });
      textareaRef.current?.setSelectionRange(newSelectionStart, newSelectionEnd);
    }, []),
  });

  useEffect(() => {
    fetchFile(fileId);
  }, [fetchFile, fileId]);

  useEffect(() => {
    if (file) {
      setCode(file.code);
      setCommit({ commitId: null, code: file.code });
    }
  }, [file]);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: (code) => httpRequest.put(`files/${fileId}/code`, { code }),
      requestLimiterTimeout: 600,
      requestLimiterMethod: requestLimiterMethods.THROTTLE,
      onSyncStart: () => markSyncingStart({ id: fileId }),
      onSyncSuccess: () => markSyncingSuccess({ id: fileId }),
      onSyncError: () => markSyncingFailure({ id: fileId }),
    });
  }, [markSyncingStart, markSyncingSuccess, markSyncingFailure, fileId]);

  const onCodeChange = (value) => {
    setCode(value);
    dirtyFile({ id: fileId });
    syncService.pushChanges(value);
  };

  if (fetchingFileError) {
    return <div className={sharedStyles.infoBox}>Error occurred when fetching the file.</div>;
  }

  if (isFetchingFile || !file) {
    return <Spinner centered />;
  }

  return (
    <CodeEditor
      code={code}
      onChange={onCodeChange}
      signedInView
      textareaRef={textareaRef}
      sharedViewId={file && file.sharedViewId}
      sharedEditId={file && file.sharedEditId}
      initialSharedViewEnabled={Boolean(file && file.sharedViewEnabled)}
      initialSharedEditEnabled={Boolean(file && file.sharedEditEnabled)}
      fileId={fileId}
    />
  );
};

export default connect(null, {
  dirtyFile: actions.dirtyFile,
  markSyncingStart: actions.markSyncingStart,
  markSyncingSuccess: actions.markSyncingSuccess,
  markSyncingFailure: actions.markSyncingFailure,
})(FilePage);
