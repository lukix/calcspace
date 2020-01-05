import React from 'react';
import styles from './SignInUpModal.module.scss';

interface ModalFormFieldProps {
  name: string;
  type: string;
  label: string;
  formikProps: {
    handleChange: Function;
    handleBlur: Function;
    values: object;
    errors: object;
    touched: object;
  };
}

const ModalFormField: React.FC<ModalFormFieldProps> = ({
  name,
  type,
  label,
  formikProps,
}) => {
  const { handleChange, handleBlur, values, errors, touched } = formikProps;
  return (
    <div className={styles.formField}>
      <div className={styles.label}>
        <label>{label}:</label>
        <span className={styles.errorMessage}>
          {touched[name] && errors[name]}
        </span>
      </div>
      <input
        type={type}
        name={name}
        onChange={e => handleChange(e)}
        onBlur={e => handleBlur(e)}
        value={values[name]}
      />
    </div>
  );
};

export default ModalFormField;
