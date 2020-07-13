import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import routes from '../shared/routes';
import useAsyncAction from '../shared/useAsyncAction';

const useCreateAndOpenSharedFile = (createSharedFileAction, { openInNewTab = false } = {}) => {
  const [
    createSharedFile,
    sharedFile,
    isCreatingSharedFile,
    creatingSharedFileError,
  ] = useAsyncAction(createSharedFileAction);

  const { push: historyPush } = useHistory();

  useEffect(() => {
    if (sharedFile) {
      const url = routes.sharedEditFile.path.replace(':id', sharedFile.sharedEditId);
      if (openInNewTab) {
        window.open(url);
      } else {
        historyPush(url);
      }
    }
  }, [historyPush, openInNewTab, sharedFile]);

  return { createSharedFile, isCreatingSharedFile, creatingSharedFileError };
};

export default useCreateAndOpenSharedFile;
