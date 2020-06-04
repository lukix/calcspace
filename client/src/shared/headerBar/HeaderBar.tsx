import React, { ReactNode } from 'react';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  headerTitle?: ReactNode;
  icons?: ReactNode;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ headerTitle, icons }) => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>{headerTitle}</div>
      <div className={styles.icons}>{icons}</div>
    </div>
  );
};

export default HeaderBar;
