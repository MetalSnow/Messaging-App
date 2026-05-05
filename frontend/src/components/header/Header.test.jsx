import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';
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

describe('Header component', () => {
  const renderHeader = () =>
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

  it('renders the main heading with app name', () => {
    renderHeader();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/RippleChat/i);
  });

  it('renders the logo image', () => {
    renderHeader();

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();

    expect(img).toHaveAttribute('src', '/icons/rippleLogo.svg');
  });

  it('renders navigation landmark', () => {
    renderHeader();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders Login and Signup links', () => {
    renderHeader();

    const loginLink = screen.getByRole('link', { name: /login/i });
    const signupLink = screen.getByRole('link', { name: /signup/i });

    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });

  it('links point to correct routes', () => {
    renderHeader();

    const loginLink = screen.getByRole('link', { name: /login/i });
    const signupLink = screen.getByRole('link', { name: /signup/i });

    expect(loginLink).toHaveAttribute('href', '/login');
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('renders theme toggle control', () => {
    renderHeader();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
