import React from 'react';
import { render } from '@testing-library/react';
import NoteCard from '../NoteCard';

const defaultProps = {
  updateExpression: () => {},
  backspaceDeleteExpression: () => {},
  enterAddExpression: () => {},
  deleteCard: () => {},
};

describe('NoteCard component', () => {
  it('should initialize with a given expressions list', () => {
    // given
    const expressions = [
      { id: '1', value: 'x = 4', showResult: false },
      { id: '2', value: 'y = 5', showResult: false },
    ];

    // when
    const { queryByText } = render(
      <NoteCard {...defaultProps} expressions={expressions} />
    );

    // then
    expect(queryByText('x = 4', { exact: false })).not.toEqual(null);
    expect(queryByText('y = 5', { exact: false })).not.toEqual(null);
  });
});
