import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import Signup from './Signup';
import usePost from '../../hooks/usePost';
/*global describe, it, expect, vi, beforeEach */

const mockNavigate = vi.fn();
const mockPostData = vi.fn();

vi.mock('../../hooks/usePost');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('Auth components', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    usePost.mockReturnValue({
      postData: mockPostData,
      validation: null,
      error: null,
      loading: false,
    });
  });

  describe('Login', () => {
    it('renders login form', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole('heading', { name: /log in/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /log in/i }),
      ).toBeInTheDocument();
    });

    it('submits login form', async () => {
      const user = userEvent.setup();

      mockPostData.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      await user.type(screen.getByLabelText(/username/i), 'metalSnow');

      await user.type(screen.getByLabelText(/password/i), '123456');

      await user.click(screen.getByRole('button', { name: /log in/i }));

      expect(mockPostData).toHaveBeenCalledWith({
        username: 'metalSnow',
        password: '123456',
      });
    });
  });

  describe('Signup', () => {
    it('renders signup form', () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole('heading', { name: /sign up/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    it('submits signup form', async () => {
      const user = userEvent.setup();

      mockPostData.mockResolvedValue({ status: 200 });

      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>,
      );

      await user.type(screen.getByLabelText(/username/i), 'metalSnow');

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');

      await user.type(screen.getByLabelText(/^password/i), '123456');

      await user.type(screen.getByLabelText(/confirm password/i), '123456');

      await user.click(screen.getByRole('button', { name: /sign up/i }));

      expect(mockPostData).toHaveBeenCalledWith({
        username: 'metalSnow',
        email: 'test@test.com',
        password: '123456',
        confirmedPassword: '123456',
      });
    });
  });
});
