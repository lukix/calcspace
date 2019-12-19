import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ExpressionInput from '../ExpressionInput';

describe('ExpressionInput component', () => {
  it('should be focused after mount', () => {
    // when
    const { container } = render(<ExpressionInput defaultValue="a = 5" />);

    // then
    const input = container.querySelector('input');
    expect(document.activeElement === input).toEqual(true);
  });

  it("should call onEnterKeyDown with input's value splited by cursor position", () => {
    // given
    const onEnterKeyDown = jest.fn();
    const { container } = render(
      <ExpressionInput
        defaultValue="a = 5 + 99"
        onEnterKeyDown={onEnterKeyDown}
      />
    );
    const input = container.querySelector('input');
    if (!input) {
      throw new Error('Input not found');
    }

    // when
    input.setSelectionRange(5, 5);
    fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });

    // then
    expect(onEnterKeyDown).toHaveBeenCalledTimes(1);
    expect(onEnterKeyDown).toHaveBeenCalledWith('a = 5', ' + 99');
  });

  it('should call backspace key down callback when the cursor is on the first position', () => {
    // given
    const onEdgeBackspaceKeyDown = jest.fn();
    const { container } = render(
      <ExpressionInput
        defaultValue="a = 5 + 99"
        onEdgeBackspaceKeyDown={onEdgeBackspaceKeyDown}
      />
    );
    const input = container.querySelector('input');
    if (!input) {
      throw new Error('Input not found');
    }

    // when
    input.setSelectionRange(0, 0); // Cursor is on the beginning of the input
    fireEvent.keyDown(input, { key: 'Backspace', code: 8, charCode: 8 });

    // then
    expect(onEdgeBackspaceKeyDown).toHaveBeenCalledTimes(1);
    expect(onEdgeBackspaceKeyDown).toHaveBeenCalledWith('a = 5 + 99');
  });

  it('should not call backspace key down callback when the cursor is not on the first position', () => {
    // given
    const onEdgeBackspaceKeyDown = jest.fn();
    const { container } = render(
      <ExpressionInput
        defaultValue="a = 5 + 99"
        onEdgeBackspaceKeyDown={onEdgeBackspaceKeyDown}
      />
    );
    const input = container.querySelector('input');
    if (!input) {
      throw new Error('Input not found');
    }

    // when
    input.setSelectionRange(3, 3); // Cursor is NOT on the beginning of the input
    fireEvent.keyDown(input, { key: 'Backspace', code: 8, charCode: 8 });

    // then
    expect(onEdgeBackspaceKeyDown).toHaveBeenCalledTimes(0);
  });
});
