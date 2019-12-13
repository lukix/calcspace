import React, { useState, useEffect } from 'react';
import InputWithAutoFocus from './InputWithAutoFocus';

interface MathExpressionProps {
  value: string;
  onValueChange: (value: string) => void;
}

const MathExpression: React.FC<MathExpressionProps> = ({
  value,
  onValueChange,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const [isInEditMode, setIsInEditMode] = useState(false);
  const enterEditMode = () => setIsInEditMode(true);
  const leaveEditMode = () => {
    onValueChange(currentValue);
    setIsInEditMode(false);
  };

  if (isInEditMode) {
    return (
      <div>
        <InputWithAutoFocus
          value={currentValue}
          onChange={e => setCurrentValue(e.target.value)}
          onBlur={leaveEditMode}
        />
      </div>
    );
  } else {
    return <div onClick={enterEditMode}>{value || 'Empty expression'}</div>;
  }
};

export default MathExpression;
