import { render, screen } from '@testing-library/react';
import App from './App';
/*global describe, it, expect*/

describe('App component', () => {
  it('renders correct heading', () => {
    render(<App />);

    expect(screen.getByRole('heading').textContent).toMatchSnapshot();

    screen.debug();
  });
});
