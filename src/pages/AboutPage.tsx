import React from 'react';
import { ShieldCheck, Rocket, Award, Users, Cpu, Activity, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 1: Hero Manifesto */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1020] border border-[#38D9D9]/30 text-[#38D9D9] text-[10px] font-orbitron font-bold uppercase tracking-widest">
            <Rocket className="w-3.5 h-3.5" />
            <span>INTERPLANETARY FLIGHT AGENCY MANIFESTO</span>
          </div>
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl uppercase tracking-[0.06em] text-white">
            MAKING HUMANITY <br />
            <span className="text-[#FF5A1F]">MULTI-PLANETARY</span>
          </h1>
          <p className="text-sm sm:text-base text-[#BAC2D6] font-space leading-relaxed">
            Founded in 2084, SPACED was established with a singular directive: transform space exploration from rare government science missions into accessible, ultra-luxurious, and routine interplanetary voyages.
          </p>
        </div>

        {/* Section 2: Core Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-3 hud-corner">
            <div className="w-10 h-10 rounded-sm bg-[#05070D] border border-[#38D9D9]/40 flex items-center justify-center text-[#38D9D9]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-lg text-white uppercase">
              Quantum Fusion Drives
            </h3>
            <p className="text-xs text-[#BAC2D6] font-space leading-relaxed">
              Our pulse-detonation magnetic fusion thrusters accelerate spacecraft to relativistic cruise velocities, cutting the Earth-to-Mars transfer transit down to just 90 days.
            </p>
          </div>

          <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-3 hud-corner">
            <div className="w-10 h-10 rounded-sm bg-[#05070D] border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-lg text-white uppercase">
              Triple Redundant Life Support
            </h3>
            <p className="text-xs text-[#BAC2D6] font-space leading-relaxed">
              Closed-loop bioregenerative oxygen synthesis and active superconducting magnetic radiation shielding ensure Earth-level safety during interstellar storms.
            </p>
          </div>

          <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-3 hud-corner">
            <div className="w-10 h-10 rounded-sm bg-[#05070D] border border-[#38D9D9]/40 flex items-center justify-center text-[#38D9D9]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-orbitron font-bold text-lg text-white uppercase">
              Five-Star Orbital Habitation
            </h3>
            <p className="text-xs text-[#BAC2D6] font-space leading-relaxed">
              Private pressurized suites, artificial centrifugal 1G gravity wings, panoramic sapphire observation domes, and zero-G fine dining curated by world-class chefs.
            </p>
          </div>
        </div>

        {/* Section 3: Safety and Academy */}
        <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-orbitron text-[#FF5A1F] uppercase tracking-widest font-bold">
                ASTRONAUT READINESS ACADEMY
              </span>
              <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white uppercase">
                Comprehensive Pre-Flight Preparation
              </h2>
              <p className="text-xs sm:text-sm text-[#BAC2D6] font-space leading-relaxed">
                Prior to embarkation, all travelers complete a 72-hour specialized simulation program at our Low Earth Orbit training gateway. You’ll master Bio-Suit 2.0 telemetry controls, low-gravity maneuvering, and emergency orbital protocols.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/planets"
                  className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
                >
                  EXPLORE FLIGHT CATALOG
                </Link>
                <Link
                  to="/adventures"
                  className="px-6 py-3 bg-[#05070D] border border-[#20283A] text-white font-orbitron font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
                >
                  VIEW MISSIONS
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <div className="inline-block p-6 bg-[#05070D] border border-[#38D9D9]/40 rounded-sm text-center">
                <div className="font-orbitron font-black text-4xl text-[#38D9D9]">99.9%</div>
                <div className="text-[10px] font-rajdhani uppercase tracking-widest text-[#8B91A1] mt-1">
                  MISSION SAFETY INDEX
                </div>
                <div className="mt-3 text-[11px] font-space text-[#BAC2D6]">
                  Over 140+ interplanetary sorties flown without incident.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
