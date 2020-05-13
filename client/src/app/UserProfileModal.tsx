import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, ModalFormField, SubmitButton } from '../shared/modal';

const validationSchema = yup.object().shape({
  currentPassword: yup.string().label('Current Password').required(),
  newPassword: yup.string().label('New Password').min(6).max(72).required(),
  repeatNewPassword: yup
    .mixed()
    .label('Repeat New Password')
    .oneOf([yup.ref('newPassword')], "Passwords don't match")
    .required(),
});

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
    validationSchema,
    onSubmit: async ({ currentPassword, newPassword, repeatNewPassword }, formikProps) => {
      console.log({ currentPassword, newPassword, repeatNewPassword });
    },
  });

  return (
    <Modal visible={visible} onHide={onHide}>
      <h2>Change Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <ModalFormField
          type="password"
          name="currentPassword"
          label="Current Password"
          formikProps={formik}
        />
        <ModalFormField
          type="password"
          name="newPassword"
          label="New Password"
          formikProps={formik}
        />
        <ModalFormField
          type="password"
          name="repeatNewPassword"
          label="Repeat New Password"
          formikProps={formik}
        />
        <SubmitButton value="Change Password" disabled={false} />
      </form>
    </Modal>
  );
};

export default UserProfileModal;
