import React from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../codeEditor/CodeEditor';

interface FilePageProps {
  cards: Array<{ id: string; code: string }>;
  updateCode: Function;
}

const FilePage: React.FC<FilePageProps> = ({ cards, updateCode }) => {
  const { fileId } = useParams();
  const file = cards.find(({ id }) => id === fileId);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <CodeEditor
      code={file.code}
      updateCode={code => updateCode({ code, id: fileId })}
    />
  );
};

export default FilePage;
