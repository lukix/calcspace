import debounce from 'lodash.debounce';

const SyncService = ({
  synchronize,
  debounceTimeout = 400,
  onSyncStart = () => {},
  onSyncSuccess = () => {},
  onSyncError = () => {},
}) => {
  let waitingChanges = null;
  const trySynchronizingDebounced = debounce(trySynchronizing, debounceTimeout);

  async function trySynchronizing() {
    if (waitingChanges === null) {
      return;
    }

    const changes = waitingChanges;
    waitingChanges = null;

    onSyncStart();
    try {
      await synchronize(changes);
      onSyncSuccess();
    } catch (error) {
      // TODO: Better handling errors (retry?)
      onSyncError();
    }

    trySynchronizingDebounced();
  }

  const pushChanges = changes => {
    waitingChanges = changes;

    trySynchronizingDebounced();
  };

  return { pushChanges };
};

export default SyncService;
