import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Store, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@nova-store.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.', 'Missing Credentials');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      success('Authenticated successfully. Welcome back!', 'Admin Access Granted');
      const origin = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(origin, { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid administrator credentials.', 'Authentication Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@nova-store.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-accent-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-display font-black text-2xl shadow-xl">
              N
            </div>
          </Link>
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            NOVA Management Portal
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Secure administration console & real-time inventory engine
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nova-store.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-500"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full font-bold bg-white text-zinc-950 hover:bg-zinc-200 mt-2 shadow-xl"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Console
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Assessment Demo Account
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-bold text-white bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded-md transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>Email: <span className="text-zinc-200">admin@nova-store.com</span></div>
                <div>Password: <span className="text-zinc-200">AdminPassword123!</span></div>
              </div>
            </div>
          </div>

          {/* Storefront return */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
