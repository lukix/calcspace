import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NoteCard from '../NoteCard';

describe('NoteCard component', () => {
  it('should initialize with an empty expression', () => {
    // given
    const { queryByText } = render(<NoteCard />);

    // then
    expect(queryByText('Empty expression')).not.toEqual(null);
  });

  // it('should allow to delete an expression', () => {
  //   // given
  //   const { queryByText, getByTitle } = render(<NoteCard />);

  //   // when
  //   fireEvent.click(getByTitle('Delete', { exact: false }));

  //   // then
  //   expect(queryByText('Empty expression')).toEqual(null);
  // });
});
