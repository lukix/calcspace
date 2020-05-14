import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from '../shared/httpRequest';
import { Modal, ModalFormField, SubmitButton } from '../shared/modal';
import sharedStyles from '../shared/shared.module.scss';

const validationSchema = yup.object().shape({
  currentPassword: yup.string().label('Current Password').required(),
  newPassword: yup.string().label('New Password').min(6).max(72).required(),
  repeatNewPassword: yup
    .mixed()
    .label('Repeat New Password')
    .oneOf([yup.ref('newPassword')], "Passwords don't match")
    .required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';
const OTHER_ERROR_STATUS = 'OTHER_ERROR_STATUS';
const SUCCESS_STATUS = 'SUCCESS_STATUS';

interface UserProfileModalProps {
  onHide: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onHide }) => {
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    validationSchema,
    onSubmit: async ({ currentPassword, newPassword }, formikProps) => {
      try {
        formikProps.setStatus(null);
        formikProps.setSubmitting(true);
        await httpRequest.put(`user-settings/password`, { currentPassword, newPassword });
        formik.resetForm();
        formikProps.setStatus(SUCCESS_STATUS);
      } catch (err) {
        formikProps.setStatus(
          err.response && err.response.status === 401
            ? INVALID_CREDENTIALS_STATUS
            : OTHER_ERROR_STATUS
        );
      } finally {
        formikProps.setSubmitting(false);
      }
    },
  });

  return (
    <Modal visible onHide={onHide}>
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
        <SubmitButton
          value={formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
          disabled={formik.isSubmitting}
        />
        {formik.status === INVALID_CREDENTIALS_STATUS && (
          <p className={sharedStyles.errorMessage}>Invalid current password.</p>
        )}
        {formik.status === OTHER_ERROR_STATUS && (
          <p className={sharedStyles.errorMessage}>Unexpected error has occurred.</p>
        )}
        {formik.status === SUCCESS_STATUS && (
          <p className={sharedStyles.successMessage}>Password has been changed.</p>
        )}
      </form>
    </Modal>
  );
};

export default UserProfileModal;
