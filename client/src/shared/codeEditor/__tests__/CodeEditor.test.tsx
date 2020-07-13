import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import CodeEditor from '../CodeEditor';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const defaultProps = {
  onChange: noop,
};

describe('CodeEditor component', () => {
  it('should initialize with a given expressions list', () => {
    // given
    const code = 'x = 4\ny = 5';

    // when
    const { queryAllByText } = render(
      <BrowserRouter>
        <CodeEditor {...defaultProps} code={code} signedInView />
      </BrowserRouter>
    );

    // then
    expect(queryAllByText('x = 4', { exact: false }).length).toBeGreaterThanOrEqual(1);
    expect(queryAllByText('y = 5', { exact: false }).length).toBeGreaterThanOrEqual(1);
  });

  it('should display result of an expression', () => {
    // given
    const code = 'x = 4 + 2';

    // when
    const { queryByText } = render(
      <BrowserRouter>
        <CodeEditor {...defaultProps} code={code} signedInView />
      </BrowserRouter>
    );

    // then
    expect(queryByText('= 6', { exact: false })).not.toEqual(null);
  });
});
