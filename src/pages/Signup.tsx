import { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Signup() {
  const [name, setName] = useState('');
  const { showToaster } = useToaster();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const captchaRef = useRef<HTMLDivElement>(null);

  // Set up Turnstile callback to update React state
  useEffect(() => {
    const setupTurnstileCallback = () => {
      if (window.turnstile) {
        const turnstileElement = document.getElementById('signup-turnstile');
        if (turnstileElement) {
          window.turnstile.render('#signup-turnstile', {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!captchaToken) {
      setErrors({ captcha: 'Please complete the captcha' });
      return;
    }

    const success = await signup(name, email, password, captchaToken);

    if (success) {
      showToaster('success', 'Account Created', 'Welcome! Your account has been created successfully');
      navigate('/dashboard');
    } else {
      setErrors({ email: 'An account with this email already exists' });
      showToaster('error', 'Signup Failed', 'An account with this email already exists');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="p-6 space-y-6">
            <div className="text-center mb-6">
              <img 
                src="/logo.svg" 
                alt="Candlelight Logo" 
                className="w-60 h-15 sm:w-60 sm:h-10 md:w-96 md:h-20 mx-auto mb-4"
              />
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-muted-foreground font-sans">
                Start building amazing websites with AI
              </p>
            </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <div className="flex justify-center mb-4">
              <div
                id="signup-turnstile"
                className="cf-turnstile"
                data-sitekey="0x4AAAAAAB7hJzvCyVWyLvmn"
                data-callback="onTurnstileCallback"
                data-theme="dark"
                data-size="normal"
              ></div>
            </div>
            {errors.captcha && <p className="text-sm text-destructive text-center">{errors.captcha}</p>}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

            <div className="text-center text-sm text-muted-foreground font-sans">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/Signup.png)'}}>
        <div className="text-center">
          {/* <p className="text-primary-foreground/80 text-xl font-sans">
            Join thousands of creators
          </p> */}
        </div>
      </div>
    </div>
  );
}
