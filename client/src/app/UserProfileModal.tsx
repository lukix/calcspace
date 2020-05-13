import React from 'react';
import { useFormik } from 'formik';
import { Modal, ModalFormField, SubmitButton } from '../shared/modal';

interface UserProfileModalProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ visible, onHide }) => {
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    // validationSchema,
    onSubmit: async ({ currentPassword, newPassword, repeatNewPassword }, formikProps) => {
      console.log({ currentPassword, newPassword, repeatNewPassword });
    },
  });

  return (
    <Modal visible={visible} onHide={onHide}>
      <h2>Change Password</h2>
      <ModalFormField
        type="text"
        name="currentPassword"
        label="Current Password"
        formikProps={formik}
      />
      <ModalFormField type="text" name="newPassword" label="New Password" formikProps={formik} />
      <ModalFormField
        type="text"
        name="repeatNewPassword"
        label="Repeat New Password"
        formikProps={formik}
      />
      <SubmitButton value="Change Password" disabled={false} />
    </Modal>
  );
};

export default UserProfileModal;
