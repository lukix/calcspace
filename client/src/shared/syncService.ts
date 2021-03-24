import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

export const requestLimiterMethods = {
  DEBOUNCE: 'DEBOUNCE',
  THROTTLE: 'THROTTLE',
};

const delayEdgeBehavior = {
  leading: false,
  trailing: true,
};

const SyncService = ({
  synchronize,
  requestLimiterTimeout = 400,
  requestLimiterMethod = requestLimiterMethods.DEBOUNCE,
  onSyncStart = () => {},
  onSyncSuccess = () => {},
  onSyncError = () => {},
}) => {
  let waitingChanges = null;
  const trySynchronizingLimited =
    requestLimiterMethod === requestLimiterMethods.THROTTLE
      ? throttle(trySynchronizing, requestLimiterTimeout, delayEdgeBehavior)
      : debounce(trySynchronizing, requestLimiterTimeout, delayEdgeBehavior);

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

    trySynchronizingLimited();
  }

  const pushChanges = (changes) => {
    waitingChanges = changes;

    trySynchronizingLimited();
  };

  return { pushChanges };
};

export default SyncService;
