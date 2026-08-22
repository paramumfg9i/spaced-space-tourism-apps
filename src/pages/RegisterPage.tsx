import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Lock, Mail, User, Phone, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in all mandatory flight profile parameters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await register(fullName, email, password, phone);
      navigate(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full bg-[#0B1020] border border-[#20283A] rounded-sm p-8 space-y-6 shadow-2xl hud-corner">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#05070D] border border-[#FF5A1F]/40 flex items-center justify-center mx-auto">
            <Rocket className="w-6 h-6 text-[#FF5A1F]" />
          </div>
          <h1 className="font-orbitron font-black text-2xl uppercase tracking-wider text-white">
            PILOT REGISTRATION
          </h1>
          <p className="text-xs text-[#8B91A1] font-space">
            Initialize your profile into the Interplanetary Flight Registry
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
              Full Commander Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Commander Elena Mercer"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
              Sub-Space Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.mercer@spaced.orbit"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
              ComLink Phone
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 800-555-ORBIT"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                Security Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
              />
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
                <span>REGISTERING PILOT...</span>
              </>
            ) : (
              <span>CREATE SPACE-PILOT ACCOUNT</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-[#20283A] text-xs font-space text-[#8B91A1]">
          Already have flight clearance?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-[#38D9D9] hover:underline font-orbitron text-[11px]"
          >
            LOGIN
          </Link>
        </div>

      </div>
    </div>
  );
};
