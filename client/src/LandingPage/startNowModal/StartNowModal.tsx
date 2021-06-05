import React from 'react';
import { Switch, Case, Default } from 'react-when-then';

import httpRequest from '../../shared/httpRequest';
import Spinner from '../../shared/spinner';
import { Modal } from '../../shared/modal';
import useCreateAndOpenSharedFile from '../../shared/useCreateAndOpenSharedFile';
import styles from './StartNowModal.module.scss';

const createSharedFileAction = () => httpRequest.post(`shared-files`);

interface StartNowModalProps {}

const StartNowModal: React.FC<StartNowModalProps> = () => {
  const {
    createSharedFile,
    isCreatingSharedFile,
    creatingSharedFileError,
  } = useCreateAndOpenSharedFile(createSharedFileAction);

  return (
    <Modal
      visible
      title="Try Without Signing In"
      floating={false}
      className={styles.tryWithoutAccountModal}
    >
      <Spinner show={isCreatingSharedFile} centered>
        <button onClick={createSharedFile}>
          <Switch>
            <Case when={creatingSharedFileError}>Error occurred. Click to try again.</Case>
            <Default>Start now!</Default>
          </Switch>
        </button>
      </Spinner>
    </Modal>
  );
};

export default StartNowModal;
