import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ShieldCheck, Globe, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#05070D] border-t border-[#20283A] pt-16 pb-12 overflow-hidden">
      
      {/* Giant SPACED Background Watermark (from reference image) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] text-white font-orbitron font-black text-[120px] sm:text-[180px] md:text-[240px] tracking-[0.25em] whitespace-nowrap leading-none z-0">
        SPACED
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-12 border-b border-[#20283A]/70">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-[#0B1020] border border-[#38D9D9]/40 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-[#38D9D9]" />
              </div>
              <span className="font-orbitron font-black text-2xl tracking-[0.25em] text-white">
                SPACED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8B91A1] max-w-md font-space leading-relaxed">
              Pioneering interstellar travel since 2084. Safety, luxury, and the vast unknown. Orbital transfers, lunar escapes, and deep-space cryo voyages.
            </p>
          </div>

          {/* Links & Navigation (as shown in screenshot) */}
          <div className="md:col-span-6 flex flex-col md:items-end space-y-4">
            <div className="flex flex-wrap gap-6 text-[11px] font-orbitron uppercase tracking-[0.15em] text-[#8B91A1]">
              <Link to="/about" className="hover:text-[#38D9D9] transition-colors">
                PRIVACY POLICY
              </Link>
              <Link to="/about" className="hover:text-[#38D9D9] transition-colors">
                TERMS OF SERVICE
              </Link>
              <Link to="/adventures" className="hover:text-[#38D9D9] transition-colors">
                LAUNCH PROTOCOL
              </Link>
              <a href="#testimonials" className="hover:text-[#38D9D9] transition-colors">
                CONTACT AGENCY
              </a>
            </div>

            <div className="text-[10px] font-rajdhani text-[#8B91A1] tracking-widest uppercase">
              © 2026 SPACED INTERSTELLAR. ALL RIGHTS RESERVED.
            </div>
          </div>

        </div>

        {/* Sub-footer Telemetry strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-rajdhani text-[#8B91A1] tracking-widest gap-2">
          <div className="flex items-center gap-4">
            <span className="text-[#38D9D9]">GATEWAY STATUS: NOMINAL</span>
            <span>FREQ: 1420.405 MHz (HYDROGEN LINE)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38D9D9] animate-ping" />
            <span>SOLAR SYSTEM REGISTRATION #SPC-8492</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
