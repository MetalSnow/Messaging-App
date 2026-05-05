import App from '../App';
import ErrorPage from '../error/ErrorPage';

const routes = [
  {
    path: '/:name?',
    element: <App />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
