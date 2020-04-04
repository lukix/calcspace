import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  username: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ username }) => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>
        <Link to="/">Math IDE</Link>
      </div>
      <div className={styles.icons}>
        {username && <FaUserCircle title={`Logged in as "${username}"`} />}
      </div>
    </div>
  );
};

export default HeaderBar;
