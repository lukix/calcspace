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
});
