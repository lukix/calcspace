import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import CodeEditor from './codeEditor/CodeEditor';
import SyncService from './syncService';
import sharedStyles from '../shared/shared.module.scss';

interface FilePageProps {}

const fetchFileAction = id => httpRequest.get(`files/${id}`);

const FilePage: React.FC<FilePageProps> = () => {
  const { fileId } = useParams();
  const [fetchFile, file, isFetchingFile, fetchingFileError] = useAsyncAction(
    fetchFileAction
  );

  useEffect(() => {
    fetchFile(fileId);
  }, [fetchFile, fileId]);

  const syncService = useMemo(() => {
    return SyncService({
      synchronize: code => httpRequest.put(`files/${fileId}/code`, { code }),
      debounceTimeout: 1500,
    });
  }, [fileId]);

  const onCodeChange = value => {
    syncService.pushChanges(value);
  };

  if (fetchingFileError) {
    return (
      <div className={sharedStyles.infoBox}>
        Error occured when fetching the file. File might have been deleted.
      </div>
    );
  }

  if (isFetchingFile || !file) {
    return <div className={sharedStyles.infoBox}>Loading file...</div>;
  }

  return <CodeEditor initialCode={file.code} onChange={onCodeChange} />;
};

export default FilePage;
