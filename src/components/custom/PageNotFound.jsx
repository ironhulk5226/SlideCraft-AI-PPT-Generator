import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import Header from './Header';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
        <div className="text-center max-w-2xl">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-linear-to-r from-slate-800 via-primary to-slate-700 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-600 mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-slate-500">
              It might have been moved or deleted, or you may have mistyped the URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300"
              style={{backgroundColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Need help?</h3>
            <p className="text-sm text-slate-600">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
