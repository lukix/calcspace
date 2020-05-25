import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { selectors } from '../shared/filesStore';
import Spinner from '../shared/spinner';

interface NewFilePageProps {
  isCreatingFile: boolean;
  files: Array<{ createdDate?: Date; id: string }>;
}

interface File {
  id: string;
}
interface FileWithDate {
  id: string;
  createdDate: Date;
}
const hasDate = (file: File | FileWithDate): file is FileWithDate => {
  return (file as FileWithDate).createdDate !== undefined;
};

const NewFilePage: React.FC<NewFilePageProps> = ({ isCreatingFile, files }) => {
  const { push: historyPush } = useHistory();
  useEffect(() => {
    if (!isCreatingFile) {
      const recentlyCreatedFile = [...files]
        .filter(hasDate)
        .sort((fileA, fileB) => (fileA.createdDate < fileB.createdDate ? 1 : -1))[0];
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
