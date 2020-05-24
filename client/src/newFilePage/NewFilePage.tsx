import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { selectors } from '../shared/filesStore';
import Spinner from '../shared/spinner';

interface NewFilePageProps {
  isCreatingFile: boolean;
  files: Array<{ createdDate?: Date; id: string }>;
}

const compareDates = (dateA: Date | undefined, dateB: Date | undefined) => {
  if (dateA === dateB) {
    return 0;
  }
  if (typeof dateA === 'undefined') {
    return 1;
  }
  if (typeof dateB === 'undefined') {
    return -1;
  }
  return dateA < dateB ? 1 : -1;
};

const NewFilePage: React.FC<NewFilePageProps> = ({ isCreatingFile, files }) => {
  const { push: historyPush } = useHistory();
  useEffect(() => {
    if (!isCreatingFile) {
      const recentlyCreatedFile = [...files].sort((fileA, fileB) =>
        compareDates(fileA.createdDate, fileB.createdDate)
      )[0];
      if (recentlyCreatedFile) {
        historyPush(`/file/${recentlyCreatedFile.id}`);
      }
    }
  }, [historyPush, isCreatingFile, files]);

  if (!isCreatingFile) {
    return <Redirect to="/" />;
  }

  return <Spinner centered />;
};

export default connect((state) => ({
  isCreatingFile: selectors.isCreatingFile(state),
  files: selectors.files(state),
}))(NewFilePage);
