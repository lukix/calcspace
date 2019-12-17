import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MathExpression from '../MathExpression';

const defaultProps = {
  onValueChange: () => {},
  onDelete: () => {},
};

describe('MathExpression component', () => {
  it('should display given expression', () => {
    // given
    const expression = 'E = m*c^2';

    // when
    const { getByText } = render(
      <MathExpression {...defaultProps} value={expression} />
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
      <MathExpression {...defaultProps} value={emptyExpression} />
    );

    // then
    expect(getByText(expectedPlaceholder, { exact: false })).not.toEqual(null);
  });

  it('should call a callback when exiting edit mode', () => {
    // given
    const oldExpression = 'E = m*c^2';
    const newExpresison = 'F = m * a';
    const onValueChange = jest.fn();
    const { getByText, container } = render(
      <MathExpression
        {...defaultProps}
        value={oldExpression}
        onValueChange={onValueChange}
      />
    );

    // when
    fireEvent.click(getByText(oldExpression, { exact: false }));
    const input = container.querySelector('input');
    if (!input) {
      throw new Error('Input not found');
    }
    userEvent.type(input, newExpresison);
    fireEvent.blur(input);

    // then
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(newExpresison);
  });
});
