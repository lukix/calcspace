import React from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../codeEditor/CodeEditor';
import sharedStyles from '../shared/shared.module.scss';

interface FilePageProps {
  files: Array<{ id: string; code: string }>;
  updateCode: Function;
}

const FilePage: React.FC<FilePageProps> = ({ files, updateCode }) => {
  const { fileId } = useParams();
  const file = files.find(({ id }) => id === fileId);

  if (!file) {
    return <div className={sharedStyles.infoBox}>File not found</div>;
  }

  return (
    <CodeEditor
      code={file.code}
      updateCode={code => updateCode({ code, id: fileId })}
    />
  );
};

export default FilePage;
