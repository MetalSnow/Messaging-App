import App from '../App';
import Dashboard from '../components/Dashboard/Dashboard';
import ErrorPage from '../error/ErrorPage';

const routes = [
  {
    path: '/:name?',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
];

export default routes;
