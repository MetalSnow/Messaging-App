import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';

/*global describe, it, expect */

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

  it('renders start chatting button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: /start chatting/i }),
    ).toBeInTheDocument();
  });

  it('renders feature list items', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Real-time Messaging/i)).toBeInTheDocument();

    expect(screen.getByText(/End-to-End Encryption/i)).toBeInTheDocument();

    expect(screen.getByText(/Build Your Network/i)).toBeInTheDocument();

    expect(screen.getByText(/Fast, Secure & Reliable/i)).toBeInTheDocument();
  });
});
