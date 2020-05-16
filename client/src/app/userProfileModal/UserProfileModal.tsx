import React from 'react';
import { Modal } from '../../shared/modal';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';

interface UserProfileModalProps {
  onHide: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onHide }) => {
  return (
    <Modal visible onHide={onHide}>
      <ChangePasswordForm />
      <DeleteAccountForm />
    </Modal>
  );
};

export default UserProfileModal;
