import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NoteCard from '../NoteCard';

describe('NoteCard component', () => {
  it('should initialize with a given list', () => {
    // given
    const initialList = [{ value: '' }, { value: 'x = 5' }];

    // when
    const { queryByText } = render(<NoteCard initialList={initialList} />);

    // then
    expect(queryByText('Empty expression', { exact: false })).not.toEqual(null);
    expect(queryByText('x = 5', { exact: false })).not.toEqual(null);
  });

  it('should allow to delete an expression', () => {
    // given
    const initialList = [{ value: 'expression to delete' }, { value: '' }];
    const { getByText, queryByText, container } = render(
      <NoteCard initialList={initialList} />
    );
    const expressionToDelete = container.querySelectorAll(
      '.math-expression'
    )[0];
    const deleteButton = expressionToDelete.querySelector(
      '.delete-expression-btn'
    );
    if (!deleteButton) {
      throw 'deleteButton not found';
    }

    // when
    fireEvent.click(deleteButton);

    // then
    expect(queryByText('expression to delete', { exact: false })).toEqual(null);
  });
});
