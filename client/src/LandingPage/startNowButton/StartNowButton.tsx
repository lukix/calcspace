import React from 'react';
import { Switch, Case, Default } from 'react-when-then';

import httpRequest from '../../shared/httpRequest';
import useCreateAndOpenSharedFile from '../../shared/useCreateAndOpenSharedFile';
import styles from './StartNowButton.module.scss';

const createSharedFileAction = () => httpRequest.post(`shared-files`);

interface StartNowButtonProps {}

const StartNowButton: React.FC<StartNowButtonProps> = () => {
  const {
    createSharedFile,
    isCreatingSharedFile,
    creatingSharedFileError,
  } = useCreateAndOpenSharedFile(createSharedFileAction);

  return (
    <button onClick={createSharedFile} className={styles.startNowButton}>
      <Switch>
        <Case when={creatingSharedFileError}>Error occurred. Click to try again.</Case>
        <Case when={isCreatingSharedFile}>Loading...</Case>
        <Default>Quick Start</Default>
      </Switch>
    </button>
  );
};

export default StartNowButton;
