import React, { useEffect, useRef } from 'react';

interface InputWithAutoFocus {
  [propName: string]: any;
}

const InputWithAutoFocus: React.FC<InputWithAutoFocus> = props => {
  const inputEl = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputEl && inputEl.current) {
      inputEl.current.focus();
    }
  }, []);

  return <input type="text" ref={inputEl} {...props} />;
};

export default InputWithAutoFocus;
