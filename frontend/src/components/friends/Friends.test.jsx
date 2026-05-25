import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import Friends from './Friends';
/*global describe, it, expect */

describe('Friends component', () => {
  const renderFriends = () => {
    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>,
    );
  };

  it('renders a heading', () => {
    renderFriends();

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
