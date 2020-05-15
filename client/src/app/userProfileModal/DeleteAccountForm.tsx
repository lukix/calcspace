import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from '../../shared/httpRequest';
import { ModalFormField, SubmitButton } from '../../shared/modal';
import sharedStyles from '../../shared/shared.module.scss';
import styles from './UserProfileModal.module.scss';

const validationSchema = yup.object().shape({
  password: yup.string().label('Password').required(),
});

const INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS_STATUS';
const OTHER_ERROR_STATUS = 'OTHER_ERROR_STATUS';

interface DeleteAccountFormProps {}

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = () => {
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema,
    onSubmit: async ({ password }, formikProps) => {
      console.log('TODO');
    },
  });

  return (
    <div className={styles.section}>
      <h2>Delete Account</h2>
      <form onSubmit={formik.handleSubmit}>
        <ModalFormField type="password" name="password" label="Password" formikProps={formik} />
        <SubmitButton
          className={styles.deleteAccountButton}
          value={formik.isSubmitting ? 'Deleting Account...' : 'Delete Account'}
          disabled={formik.isSubmitting}
        />
        {formik.status === INVALID_CREDENTIALS_STATUS && (
          <p className={sharedStyles.errorMessage}>Invalid current password.</p>
        )}
        {formik.status === OTHER_ERROR_STATUS && (
          <p className={sharedStyles.errorMessage}>Unexpected error has occurred.</p>
        )}
      </form>
    </div>
  );
};

export default DeleteAccountForm;
