import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Lock, Mail, AlertCircle, Loader2, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide email and flight credentials.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password credentials.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoUser = () => {
    setEmail('alex.mercer@spaced.orbit');
    setPassword('space2026');
  };

  return (
    <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full bg-[#0B1020] border border-[#20283A] rounded-sm p-8 space-y-6 shadow-2xl hud-corner">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#05070D] border border-[#38D9D9]/40 flex items-center justify-center mx-auto">
            <Rocket className="w-6 h-6 text-[#38D9D9]" />
          </div>
          <h1 className="font-orbitron font-black text-2xl uppercase tracking-wider text-white">
            PILOT LOGIN
          </h1>
          <p className="text-xs text-[#8B91A1] font-space">
            Enter your orbital flight credentials to access the console
          </p>
        </div>

        {/* Demo Quick Button */}
        <button
          type="button"
          onClick={handleFillDemoUser}
          className="w-full py-2 bg-[#121A33] border border-[#38D9D9]/40 hover:border-[#38D9D9] text-[#38D9D9] text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>USE DEMO PILOT ACCOUNT</span>
        </button>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
              Sub-Space Frequency Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@spaced.orbit"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
              Security Key / Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-sm text-xs font-space text-[#FF5A1F] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_15px_rgba(255,90,31,0.35)] hover:shadow-[0_0_25px_rgba(255,90,31,0.6)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>LOGIN TO FLIGHT DECK</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-[#20283A] text-xs font-space text-[#8B91A1]">
          Don't have an active clearance?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-[#38D9D9] hover:underline font-orbitron text-[11px]"
          >
            CREATE ACCOUNT
          </Link>
        </div>

      </div>
    </div>
  );
};
