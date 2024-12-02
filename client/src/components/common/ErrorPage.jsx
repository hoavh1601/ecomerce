import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
      <p className="text-lg text-gray-600 mb-4">
        {error.statusText || error.message}
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;