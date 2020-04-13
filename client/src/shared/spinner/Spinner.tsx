import React, { ReactNode } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import styles from './spinner.module.scss';

interface SpinnerProps {
  size?: number;
  show?: boolean;
  centered?: boolean;
  children?: ReactNode;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 100,
  show = true,
  centered = false,
  children = null,
}) => {
  if (!show) {
    return <>{children}</>;
  }

  const spinner = <MoonLoader size={size} color={'#DBD5A9'} loading={show} />;
  return centered ? (
    <div className={styles.spinnerCenteringContainer}>{spinner}</div>
  ) : (
    spinner
  );
};

export default Spinner;
