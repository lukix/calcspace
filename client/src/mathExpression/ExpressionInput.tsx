import React, { useEffect, useRef } from 'react';

interface ExpressionInputProps {
  onEnterKeyDown?: (textLeft: string, textRight: string) => void;
  onEdgeBackspaceKeyDown?: (text: string) => void;
  onDownArrowKeyDown?: (cursonPosition: number) => void;
  onUpArrowKeyDown?: (cursonPosition: number) => void;
  cursorPosition: number | null;
  [propName: string]: any;
}

const ExpressionInput: React.FC<ExpressionInputProps> = ({
  onEnterKeyDown = () => {},
  onEdgeBackspaceKeyDown = () => {},
  onDownArrowKeyDown = () => {},
  onUpArrowKeyDown = () => {},
  cursorPosition,
  ...inputProps
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputEl.current && cursorPosition !== null) {
      inputEl.current.focus();
      inputEl.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  const keyDownHandler = event => {
    const callForKey = (key, callback) => {
      if (event.key === key && inputEl.current) {
        const value = inputEl.current.value;
        const cursorPosition =
          inputEl.current.selectionStart === null
            ? value.length
            : inputEl.current.selectionStart;
        callback(value, cursorPosition);
      }
    };
    callForKey('Enter', (value, cursorPosition) => {
      onEnterKeyDown(
        value.substr(0, cursorPosition),
        value.substr(cursorPosition)
      );
    });
    callForKey('Backspace', (value, cursorPosition) => {
      if (cursorPosition === 0) {
        onEdgeBackspaceKeyDown(value);
      }
    });
    callForKey('ArrowDown', (value, cursorPosition) => {
      onDownArrowKeyDown(cursorPosition);
    });
    callForKey('ArrowUp', (value, cursorPosition) => {
      onUpArrowKeyDown(cursorPosition);
    });

    if (inputProps.onKeyDown) {
      inputProps.onKeyDown(event);
    }
  };

  return (
    <input
      type="text"
      ref={inputEl}
      {...inputProps}
      onKeyDown={keyDownHandler}
    />
  );
};

export default ExpressionInput;
