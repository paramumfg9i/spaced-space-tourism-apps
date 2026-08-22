import React from 'react';
import { Activity, Shield, Sparkles, Award, Globe, Users } from 'lucide-react';

export const AboutPioneeringSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#05070D] relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 space-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Astronaut Photo with Holographic Telemetry HUD */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-sm overflow-hidden border border-[#20283A] bg-[#0B1020] hud-corner p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              
              {/* Astronaut Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-[#090D1A]">
                <img
                  src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1000&q=80"
                  alt="SPACED Flight Commander in Bio-Suit"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter contrast-110 brightness-95"
                />

                {/* Cyber HUD Overlay badge */}
                <div className="absolute top-4 right-4 bg-[#05070D]/85 border border-[#38D9D9]/50 backdrop-blur-md px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(56,217,217,0.25)]">
                  <div className="w-2 h-2 rounded-full bg-[#38D9D9] animate-ping" />
                  <span className="text-[10px] font-orbitron font-bold tracking-widest text-[#38D9D9] uppercase">
                    TELEMETRY ONLINE
                  </span>
                </div>

                {/* Bottom Astronaut Bio Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#05070D]/90 border border-[#20283A] backdrop-blur-md p-3 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-[#FF5A1F] animate-pulse" />
                    <div>
                      <div className="text-[10px] font-orbitron font-bold text-white uppercase tracking-wider">
                        CDR. MAYA LIN
                      </div>
                      <div className="text-[9px] font-rajdhani text-[#8B91A1] uppercase tracking-widest">
                        Expedition 48 Chief Pilot
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-orbitron font-bold text-[#38D9D9]">
                      O2: 99.4%
                    </div>
                    <div className="text-[9px] font-rajdhani text-[#8B91A1]">
                      PULSE: 68 BPM
                    </div>
                  </div>
                </div>

                {/* Sub-surface holographic target reticle */}
                <div className="absolute top-1/3 left-1/4 w-12 h-12 border border-[#38D9D9]/30 rounded-full pointer-events-none animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column: Mission Manifesto & Live Statistics */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#FF5A1F]" />
              <span className="text-xs font-orbitron uppercase tracking-[0.3em] text-[#FF5A1F] font-bold">
                BEYOND EARTH
              </span>
            </div>

            {/* Display Heading */}
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.04em] text-white leading-tight">
              PIONEERING THE NEXT <br className="hidden sm:block" />
              <span className="text-[#38D9D9] drop-shadow-[0_0_20px_rgba(56,217,217,0.4)]">
                FRONTIER
              </span>{' '}
              OF TRAVEL
            </h2>

            {/* Narrative text */}
            <p className="text-sm sm:text-base text-[#BAC2D6] font-space leading-relaxed">
              SPACED is the premier orbital and interplanetary travel agency. We combine cutting-edge aerospace engineering with ultra-luxury hospitality to provide safe, comfortable, and awe-inspiring journeys across the solar system. Our mission is to make the stars accessible.
            </p>

            <p className="text-xs sm:text-sm text-[#8B91A1] font-space leading-relaxed">
              Every expedition is supported by real-time orbital mechanics AI, quantum redundant life-support networks, and seasoned astronaut flight commanders who guide you through the majestic wonders of Olympus Mons, Europa’s subsurface seas, and Titan’s methane horizons.
            </p>

            {/* Statistics Bar matching reference layout */}
            <div className="pt-6 border-t border-[#20283A] grid grid-cols-3 gap-4 sm:gap-8">
              <div className="border-l-2 border-[#FF5A1F] pl-4 space-y-0.5">
                <div className="font-orbitron font-black text-2xl sm:text-4xl text-white">
                  10<span className="text-[#FF5A1F]">+</span>
                </div>
                <div className="text-[10px] sm:text-xs font-rajdhani font-bold uppercase tracking-[0.2em] text-[#8B91A1]">
                  DESTINATIONS
                </div>
              </div>

              <div className="border-l-2 border-[#38D9D9] pl-4 space-y-0.5">
                <div className="font-orbitron font-black text-2xl sm:text-4xl text-white">
                  25K<span className="text-[#38D9D9]">+</span>
                </div>
                <div className="text-[10px] sm:text-xs font-rajdhani font-bold uppercase tracking-[0.2em] text-[#8B91A1]">
                  TRAVELERS
                </div>
              </div>

              <div className="border-l-2 border-[#FF5A1F] pl-4 space-y-0.5">
                <div className="font-orbitron font-black text-2xl sm:text-4xl text-white">
                  99<span className="text-[#FF5A1F]">%</span>
                </div>
                <div className="text-[10px] sm:text-xs font-rajdhani font-bold uppercase tracking-[0.2em] text-[#8B91A1]">
                  SAFETY RATING
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
