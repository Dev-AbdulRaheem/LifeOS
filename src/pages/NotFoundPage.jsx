import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Page not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button icon={Home}>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
