import React, { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';

interface ModalProps {
  children: ReactNode;
  visible: boolean;
  onHide?: Function;
  title?: string;
  floating?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  visible,
  onHide = () => {},
  title,
  floating = true,
}) => {
  if (!floating) {
    return (
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <div className={styles.modalHeader}>{title}</div>}
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div
      className={classNames(styles.modalOverlay, { [styles.visible]: visible })}
      onClick={() => onHide()}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <div className={styles.modalHeader}>{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
