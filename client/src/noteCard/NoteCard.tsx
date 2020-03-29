import React from 'react';
import { FaTimesCircle, FaTrash } from 'react-icons/fa';
import classNames from 'classnames';
import evaluateCode from './evaluateCode';
import styles from './NoteCard.module.scss';

interface NoteCardProps {
  code: string;
  updateCode: Function;
  deleteCard: Function;
  isActive: boolean;
  isSomeCardActive: boolean;
  unselect: Function;
  isDragging: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  code,
  updateCode,
  deleteCard,
  isActive,
  isSomeCardActive,
  unselect,
  isDragging,
}) => {
  const onCodeChange = e => {
    updateCode(e.target.value);
  };

  const evaluatedCode = evaluateCode(code);

  return (
    <div
      className={classNames(styles.card, {
        [styles.notActive]: !isActive && isSomeCardActive,
        [styles.isDragging]: isDragging,
      })}
    >
      {isActive && (
        <div className={styles.closeCardButton}>
          <FaTimesCircle onClick={() => unselect()} />
        </div>
      )}
      <div className={styles.codeWrapper}>
        {isActive && (
          <textarea
            className={styles.codeEditor}
            value={code}
            onChange={onCodeChange}
            style={{ height: `${code.split('\n').length * 1.2}rem` }}
          />
        )}
        <pre className={styles.formattedCode}>{`${evaluatedCode} `}</pre>
      </div>
      {isActive && (
        <div className={styles.cardFooter}>
          <button onClick={() => deleteCard()}>
            <FaTrash />
            Delete Card
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
