import React from 'react';
import { render } from '@testing-library/react';
import NoteCard from '../NoteCard';

const defaultProps = {
  updateCode: () => {},
  deleteCard: () => {},
  unselect: () => {},
  isActive: false,
  isSomeCardActive: false,
  isDragging: false,
};

describe('NoteCard component', () => {
  it('should initialize with a given expressions list', () => {
    // given
    const code = 'x = 4\ny = 5';
    const evaluatedCode = 'x = 4\ny = 5';

    // when
    const { queryByText } = render(
      <NoteCard {...defaultProps} code={code} evaluatedCode={evaluatedCode} />
    );

    // then
    expect(queryByText('x = 4', { exact: false })).not.toEqual(null);
    expect(queryByText('y = 5', { exact: false })).not.toEqual(null);
  });
});
