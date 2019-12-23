import React from 'react';
import { render } from '@testing-library/react';
import MathExpression from '../MathExpression';

const defaultProps = {
  onValueChange: () => {},
  onEdgeBackspacePress: () => {},
  onEnterPress: () => {},
  onDownArrowPress: () => {},
  onUpArrowPress: () => {},
  cursorPosition: null,
};

describe('MathExpression component', () => {
  it('should display given expression', () => {
    // given
    const expression = 'E = m*c^2';

    // when
    const { getByText } = render(
      <MathExpression {...defaultProps} value={expression} showResult={false} />
    );

    // then
    expect(getByText(expression, { exact: false })).not.toEqual(null);
  });

  it('should display placeholder message when given empty expression', () => {
    // given
    const emptyExpression = '';
    const expectedPlaceholder = 'Empty expression';

    // when
    const { getByText } = render(
      <MathExpression
        {...defaultProps}
        value={emptyExpression}
        showResult={false}
      />
    );

    // then
    expect(getByText(expectedPlaceholder, { exact: false })).not.toEqual(null);
  });
});
