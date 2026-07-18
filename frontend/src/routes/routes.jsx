import App from '../App';
import Dashboard from '../components/dashboard/Dashboard';
import HomePage from '../components/home/HomePage';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import ErrorPage from '../error/ErrorPage';
import Profile from '../components/profile/Profile';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/:name/:username?',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export default routes;
