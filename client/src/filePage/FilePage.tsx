import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import { actions } from '../shared/filesStore';
import Spinner from '../shared/spinner';
import CodeEditor from '../shared/codeEditor';
import SyncService from './syncService';
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

  useEffect(() => {
    fetchFile(fileId);
  }, [fetchFile, fileId]);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: (code) => httpRequest.put(`files/${fileId}/code`, { code }),
      debounceTimeout: 1500,
      onSyncStart: () => markSyncingStart({ id: fileId }),
      onSyncSuccess: () => markSyncingSuccess({ id: fileId }),
      onSyncError: () => markSyncingFailure({ id: fileId }),
    });
  }, [markSyncingStart, markSyncingSuccess, markSyncingFailure, fileId]);

  const onCodeChange = (value) => {
    dirtyFile({ id: fileId });
    syncService.pushChanges(value);
  };

  if (fetchingFileError) {
    return <div className={sharedStyles.infoBox}>Error occured when fetching the file.</div>;
  }

  if (isFetchingFile || !file) {
    return <Spinner centered />;
  }

  return <CodeEditor initialCode={file.code} onChange={onCodeChange} />;
};

export default connect(null, {
  dirtyFile: actions.dirtyFile,
  markSyncingStart: actions.markSyncingStart,
  markSyncingSuccess: actions.markSyncingSuccess,
  markSyncingFailure: actions.markSyncingFailure,
})(FilePage);
