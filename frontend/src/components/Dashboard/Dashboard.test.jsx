import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
/*global describe, it, expect, vi */

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };

vi.mock('../../hooks/useFetch', () => ({
  default: () => ({
    fetchData: vi.fn().mockResolvedValue({
      username: 'Metal',
    }),
    loading: false,
    error: null,
  }),
}));

describe('Dashboard component', () => {
  it('renders header, aside and main content', () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    screen.debug();
    expect(container).toMatchSnapshot();
  });
});
