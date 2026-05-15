import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';

/*global describe, it, vi, expect */

vi.mock('../header/Header', () => ({
  default: () => <div>Header</div>,
}));

vi.mock('../auth/Login', () => ({
  default: () => <div>Login Component</div>,
}));

vi.mock('../auth/Signup', () => ({
  default: () => <div>Signup Component</div>,
}));

describe('HomePage', () => {
  it('renders homepage content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Ripple Chat')).toBeInTheDocument();

    expect(
      screen.getByText('Connect with friends and grow your network.'),
    ).toBeInTheDocument();
  });

  it('renders signup component', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/:name" element={<HomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Signup Component')).toBeInTheDocument();
  });

  it('renders login component', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/:name" element={<HomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });
});
