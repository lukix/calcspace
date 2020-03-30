import React, { Fragment, useRef, useEffect } from 'react';
import { FaTimesCircle, FaTrash } from 'react-icons/fa';
import classNames from 'classnames';
import evaluateCode, { tokens as availableTokens } from './evaluateCode';
import styles from './NoteCard.module.scss';

const HighlightedLine = ({ tokens }) => {
  return tokens.map(({ value, tags }, index) => {
    const className = classNames({
      [styles.tokenVirtual]: tags.includes(availableTokens.VIRTUAL),
      [styles.tokenError]: tags.includes(availableTokens.ERROR),
    });
    return (
      <span key={index} className={className}>
        {value}
      </span>
    );
  });
};

const HighlightedCode = ({ tokenizedLines }) => {
  return tokenizedLines.map((tokens, index) => (
    <Fragment key={index}>
      <HighlightedLine tokens={tokens} />
      <br />
    </Fragment>
  ));
};

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
  const textareaElement = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && textareaElement.current) {
      textareaElement.current.focus();
    }
  }, [isActive]);

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
            ref={textareaElement}
            className={styles.codeEditor}
            value={code}
            onChange={onCodeChange}
            style={{ height: `${code.split('\n').length * 1.2}rem` }}
          />
        )}
        <pre className={styles.formattedCode}>
          <HighlightedCode tokenizedLines={evaluatedCode} />
        </pre>
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
