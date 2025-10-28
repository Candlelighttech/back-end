import { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Sparkles } from 'lucide-react';
import { useToaster } from '@/contexts/ToasterContext';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const { showToaster } = useToaster();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const captchaRef = useRef<HTMLDivElement>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Set up Turnstile callback to update React state
  useEffect(() => {
    const setupTurnstileCallback = () => {
      if (window.turnstile) {
        const turnstileElement = document.getElementById('login-turnstile');
        if (turnstileElement) {
          window.turnstile.render('#login-turnstile', {
            sitekey: '0x4AAAAAAB7hJzvCyVWyLvmn',
            callback: (token: string) => {
              console.log('Turnstile completed:', token);
              setCaptchaToken(token);
              // Also set the global variable for backward compatibility
              (window as any).captchaToken = token;
              // Dispatch custom event for backward compatibility
              const event = new CustomEvent('captchaComplete', { detail: token });
              window.dispatchEvent(event);
            },
            theme: 'dark',
            size: 'normal'
          });
        }
      }
    };

    // Wait for Turnstile to load if not already loaded
    if (window.turnstile) {
      setupTurnstileCallback();
    } else {
      // Wait for the script to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          setupTurnstileCallback();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkTurnstile), 10000);
    }

    // Cleanup function to reset captcha token when component unmounts
    return () => {
      setCaptchaToken('');
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the captcha');
      return;
    }

    const success = await login(email, password, captchaToken);

    if (success) {
      showToaster('success', 'Login Successful', 'Welcome back! You have been logged in successfully');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
      showToaster('error', 'Login Failed', 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/Login.png)'}}>
        <div className="text-center">
          {/* <p className="text-primary-foreground/80 text-xl font-sans">
            Build amazing websites with AI
          </p> */}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="p-6 space-y-6">
            <div className="text-center mb-6">
              <img 
                src="/1.svg" 
                alt="Candlelight Logo" 
                className="w-60 h-15 sm:w-60 sm:h-10 md:w-96 md:h-20 mx-auto mb-4"
              />
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground font-sans">
                Sign in to your account
              </p>
            </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? 'Email is required' : ''}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error && !password ? 'Password is required' : ''}
            />

            <div className="flex justify-center mb-4">
              <div
                id="login-turnstile"
                className="cf-turnstile"
                data-sitekey="0x4AAAAAAB7hJzvCyVWyLvmn"
                data-callback="onTurnstileCallback"
                data-theme="dark"
                data-size="normal"
              ></div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

            <div className="text-center text-sm text-muted-foreground font-sans">
              Don't have an account?{' '}
              <Link to="/signup" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
