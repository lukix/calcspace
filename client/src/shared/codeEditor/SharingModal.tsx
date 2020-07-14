import React from 'react';
import Toggle from 'react-toggle';

import Spinner from '../../shared/spinner';
import { Modal } from '../../shared/modal';
import getUrlToShare from '../../shared/getUrlToShare';
import routes from '../../shared/routes';
import useAsyncAction from '../../shared/useAsyncAction';
import httpRequest from '../../shared/httpRequest';

import 'react-toggle/style.css';
import styles from './CodeEditor.module.scss';

const updateViewFlagAction = (fileId, enabled) =>
  httpRequest.put(`files/${fileId}/shared-view-enabled`, { enabled });
const updateEditFlagAction = (fileId, enabled) =>
  httpRequest.put(`files/${fileId}/shared-edit-enabled`, { enabled });

interface SharingModalProps {
  visible: boolean;
  hide: Function;
  fileId?: string;
  sharedViewId?: string;
  sharedEditId?: string;
  sharedViewEnabled: boolean;
  sharedEditEnabled: boolean;
  setSharedViewEnabled: Function;
  setSharedEditEnabled: Function;
  signedInView: boolean;
}

const SharingModal: React.FC<SharingModalProps> = ({
  visible,
  hide,
  fileId,
  sharedViewId,
  sharedEditId,
  sharedViewEnabled,
  sharedEditEnabled,
  setSharedViewEnabled,
  setSharedEditEnabled,
  signedInView,
}) => {
  const [updateViewFlag, , isUpdatingViewFlag] = useAsyncAction(updateViewFlagAction);
  const [updateEditFlag, , isUpdatingEditFlag] = useAsyncAction(updateEditFlagAction);

  const sharedViewUrl = getUrlToShare(routes.sharedViewFile.path, sharedViewId);
  const sharedEditUrl = getUrlToShare(routes.sharedEditFile.path, sharedEditId);

  const toggleSharedView = () => {
    setSharedViewEnabled(!sharedViewEnabled);
    updateViewFlag(fileId, !sharedViewEnabled);
  };

  const toggleSharedEdit = () => {
    setSharedEditEnabled(!sharedEditEnabled);
    updateEditFlag(fileId, !sharedEditEnabled);
  };

  return (
    <Modal visible={visible} onHide={hide} title="Sharing Options">
      {sharedViewId && (
        <div>
          <div>
            <label className={styles.modalToggleLabel}>
              <Toggle
                checked={sharedViewEnabled}
                onChange={toggleSharedView}
                className={styles.modalToggle}
                disabled={isUpdatingViewFlag || !signedInView}
              />
              <span>
                <Spinner size={16} color="#2B3A45" show={isUpdatingViewFlag}>
                  Link for read-only access is {sharedViewEnabled ? 'enabled' : 'disabled'}
                </Spinner>
              </span>
            </label>
          </div>
          {sharedViewEnabled && !isUpdatingViewFlag && (
            <input
              type="text"
              readOnly
              value={sharedViewUrl}
              className={styles.sharedModalUrlBox}
            />
          )}
        </div>
      )}
      {sharedEditId && (
        <div className={styles.shareModeContainer}>
          <div>
            <label className={styles.modalToggleLabel}>
              <Toggle
                checked={sharedEditEnabled}
                onChange={toggleSharedEdit}
                className={styles.modalToggle}
                disabled={isUpdatingEditFlag || !signedInView}
              />
              <span>
                <Spinner size={16} color="#2B3A45" show={isUpdatingEditFlag}>
                  Link for full access is {sharedEditEnabled ? 'enabled' : 'disabled'}
                </Spinner>
              </span>
            </label>
          </div>
          {sharedEditEnabled && !isUpdatingEditFlag && (
            <input
              type="text"
              readOnly
              value={sharedEditUrl}
              className={styles.sharedModalUrlBox}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default SharingModal;
