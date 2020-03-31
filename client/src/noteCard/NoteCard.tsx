import React, { Fragment, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
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
}

const NoteCard: React.FC<NoteCardProps> = ({
  code,
  updateCode,
  deleteCard,
}) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);

  const focusTextarea = () => {
    if (textareaElement.current) {
      textareaElement.current.focus();
    }
  };

  const onCodeChange = e => {
    updateCode(e.target.value);
  };

  const evaluatedCode = evaluateCode(code);

  return (
    <div className={styles.card} onClick={focusTextarea}>
      <div className={styles.codeWrapper}>
        <textarea
          ref={textareaElement}
          className={styles.codeEditor}
          value={code}
          onChange={onCodeChange}
          style={{ height: `${code.split('\n').length * 1.2}rem` }}
        />
        <pre className={styles.formattedCode}>
          <HighlightedCode tokenizedLines={evaluatedCode} />
        </pre>
      </div>
      <div className={styles.cardFooter}>
        <button onClick={() => deleteCard()}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
