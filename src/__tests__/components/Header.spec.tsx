import singletonRouter from 'next/router';
import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';

import { Header } from '../../components/Header';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('<Header />', () => {
  it('should be able to render logo', () => {
    render(<Header />);

    screen.getByAltText(/spacetraveling logo/i);
  });

  it('should be able to navigate to home page after a click in logo', () => {
    mockRouter.setCurrentUrl('/some-path');

    render(<Header />);

    const link = screen.getByAltText(/spacetraveling logo/i);

    fireEvent.click(link);

    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });
});
