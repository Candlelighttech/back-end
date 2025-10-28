import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="text-center max-w-md sm:max-w-lg mx-auto animate-fade-up">
        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <img 
            src="/Logo.svg" 
            alt="Candlelight Logo" 
            className="w-32 h-12 sm:w-40 sm:h-40 md:w-80 md:h-10 mx-auto mb-4"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-heading font-bold text-secondary animate-bounce-in">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3 sm:mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-sans">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}