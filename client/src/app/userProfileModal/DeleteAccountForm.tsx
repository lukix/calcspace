import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from '../../shared/httpRequest';
import { ModalFormField, SubmitButton } from '../../shared/modal';
import routes from '../../shared/routes';
import sharedStyles from '../../shared/shared.module.scss';
import { clearAuthToken } from '../../shared/authToken';
import styles from './UserProfileModal.module.scss';

const validationSchema = yup.object().shape({
  password: yup.string().label('Password').required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';
const OTHER_ERROR_STATUS = 'OTHER_ERROR_STATUS';
const SUCCESS_STATUS = 'SUCCESS_STATUS';

const getSubmitButtonLabel = (confirmed, isSubmitting) => {
  if (isSubmitting) {
    return 'Deleting Account...';
  }
  if (!confirmed) {
    return 'Delete Account';
  }
  return 'Click again to irreversibly delete your account';
};

interface DeleteAccountFormProps {}

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema,
    onSubmit: async ({ password }, formikProps) => {
      if (!isConfirmed) {
        return setIsConfirmed(true);
      }
      try {
        formikProps.setStatus(null);
        formikProps.setSubmitting(true);
        await httpRequest.delete(`user-settings/account`, { password });
        clearAuthToken();
        formik.resetForm();
        formikProps.setStatus(SUCCESS_STATUS);
        setTimeout(() => {
          window.location.replace(routes.home.path);
        }, 3000);
      } catch (err) {
        formikProps.setStatus(
          err.response && err.response.status === 401
            ? INVALID_CREDENTIALS_STATUS
            : OTHER_ERROR_STATUS
        );
      } finally {
        formikProps.setSubmitting(false);
        setIsConfirmed(false);
      }
    },
  });

  return (
    <div className={styles.section}>
      <h2>Delete Account</h2>
      <form onSubmit={formik.handleSubmit}>
        <ModalFormField type="password" name="password" label="Password" formikProps={formik} />
        <SubmitButton
          className={styles.deleteAccountButton}
          value={getSubmitButtonLabel(isConfirmed, formik.isSubmitting)}
          disabled={formik.isSubmitting}
        />
        {formik.status === INVALID_CREDENTIALS_STATUS && (
          <p className={sharedStyles.errorMessage}>Invalid password.</p>
        )}
        {formik.status === OTHER_ERROR_STATUS && (
          <p className={sharedStyles.errorMessage}>Unexpected error has occurred.</p>
        )}
        {formik.status === SUCCESS_STATUS && (
          <p className={sharedStyles.successMessage}>
            Your account has been deleted. You will be redirected to the home page in a few seconds.
          </p>
        )}
      </form>
    </div>
  );
};

export default DeleteAccountForm;
