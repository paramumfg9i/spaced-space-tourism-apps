import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Rocket, User as UserIcon, LogOut, Menu, X, Shield, Calendar, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', path: '/#explore' },
    { name: 'Adventures', path: '/adventures' },
    { name: 'About', path: '/about' },
    { name: 'Planets', path: '/planets' },
    { name: 'Testimonials', path: '/#testimonials' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070D]/85 backdrop-blur-md border-b border-[#20283A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-sm bg-[#0B1020] border border-[#38D9D9]/40 flex items-center justify-center relative group-hover:border-[#FF5A1F] transition-colors">
            <Rocket className="w-5 h-5 text-[#38D9D9] group-hover:text-[#FF5A1F] transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF5A1F] rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-2xl tracking-[0.25em] text-white group-hover:text-[#38D9D9] transition-colors">
              SPACED
            </span>
            <span className="text-[9px] font-rajdhani tracking-[0.3em] text-[#8B91A1] -mt-1 uppercase">
              Interplanetary Flight Agency
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="text-xs font-rajdhani font-semibold uppercase tracking-[0.2em] text-[#8B91A1] hover:text-[#38D9D9] transition-colors cursor-pointer py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#38D9D9] hover:after:w-full after:transition-all"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0B1020] border border-[#20283A] text-xs font-rajdhani font-bold tracking-wider text-[#F5F5F5] hover:border-[#38D9D9] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#38D9D9]" />
                <span>DASHBOARD</span>
              </Link>
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0B1020] border border-[#20283A] text-xs font-rajdhani font-bold tracking-wider text-[#F5F5F5] hover:border-[#38D9D9] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>MY BOOKINGS</span>
              </Link>
              <div className="h-6 w-[1px] bg-[#20283A]" />
              <Link
                to="/profile"
                className="flex items-center gap-2 text-xs font-rajdhani text-[#8B91A1] hover:text-white transition-colors"
                title="View Profile"
              >
                <div className="w-7 h-7 rounded-full bg-[#172033] border border-[#38D9D9]/30 flex items-center justify-center text-[11px] font-bold text-[#38D9D9]">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.full_name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-[#8B91A1] hover:text-[#FF5A1F] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-rajdhani font-bold tracking-[0.15em] uppercase text-[#8B91A1] hover:text-white transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/planets"
                className="px-5 py-2.5 rounded-sm bg-[#FF5A1F] hover:bg-[#ff6f3b] text-white text-xs font-orbitron font-bold tracking-[0.15em] uppercase transition-all shadow-[0_0_15px_rgba(255,90,31,0.35)] hover:shadow-[0_0_20px_rgba(255,90,31,0.6)]"
              >
                BOOK A MISSION
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              to="/my-bookings"
              className="p-2 text-[#38D9D9]"
              title="My Bookings"
            >
              <Calendar className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#8B91A1] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1020] border-b border-[#20283A] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left py-2 text-sm font-rajdhani font-semibold uppercase tracking-wider text-[#8B91A1] hover:text-[#38D9D9]"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-[#20283A] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-sm bg-[#172033] text-xs font-orbitron text-white tracking-wider"
                >
                  DASHBOARD
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-sm bg-[#05070D] border border-[#38D9D9]/40 text-xs font-orbitron text-[#38D9D9] tracking-wider"
                >
                  MY BOOKINGS
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-rajdhani text-[#FF5A1F] uppercase tracking-wider"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-sm bg-[#172033] text-xs font-orbitron text-white tracking-wider"
                >
                  LOGIN / SIGNUP
                </Link>
                <Link
                  to="/planets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-sm bg-[#FF5A1F] text-xs font-orbitron text-white tracking-wider shadow-[0_0_15px_rgba(255,90,31,0.4)]"
                >
                  EXPLORE WORLDS
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
