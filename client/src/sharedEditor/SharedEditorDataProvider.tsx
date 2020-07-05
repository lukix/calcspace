import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserGuide from '../shared/userGuide';

import useAsyncAction from '../shared/useAsyncAction';
import httpRequest from '../shared/httpRequest';
import Spinner from '../shared/spinner';

import SharedEditorHeaderBar from './SharedEditorHeaderBar';
import { syncStatuses } from './constants';
import SharedEditor from './SharedEditor';
import styles from './SharedEditor.module.scss';

const fetchFileAction = (id, viewOnly) =>
  httpRequest.get(`shared-files/${viewOnly ? 'view' : 'edit'}/${id}`);

interface SharedEditorDataProviderProps {
  viewOnly?: boolean;
}

const SharedEditorDataProvider: React.FC<SharedEditorDataProviderProps> = ({
  viewOnly = false,
}) => {
  const { id } = useParams();
  const [
    fetchFile,
    initialFileCommit,
    isFetchingFile,
    fetchingFileError,
    hasPerformedInitialFetch,
  ] = useAsyncAction(fetchFileAction);
  const [syncStatus, setSyncStatus] = useState(syncStatuses.SYNCED);

  useEffect(() => {
    fetchFile(id, viewOnly);
  }, [fetchFile, id, viewOnly]);

  const renderContent = () => {
    if (isFetchingFile || !hasPerformedInitialFetch) {
      return <Spinner centered />;
    }
    if (fetchingFileError) {
      return (
        <div>
          Couldn't load the file. It may be due to one of these reasons:
          <ul>
            <li>The URL is incorrect.</li>
            <li>The file has been removed due to not being visited for more than 30 days.</li>
            <li>Some other unexpected error has occured.</li>
          </ul>
        </div>
      );
    }
    return (
      <SharedEditor
        id={id}
        viewOnly={viewOnly}
        setSyncStatus={setSyncStatus}
        initialFileCommit={initialFileCommit}
      />
    );
  };

  return (
    <div className={styles.sharedEditorPage}>
      <SharedEditorHeaderBar syncStatus={syncStatus} />
      <div className={styles.sharedEditorSectionsWrapper}>
        <div className={styles.editorWrapper}>{renderContent()}</div>
        <div className={styles.guideWrapper}>
          <UserGuide isSignedIn={false} />
        </div>
      </div>
    </div>
  );
};

export default SharedEditorDataProvider;
