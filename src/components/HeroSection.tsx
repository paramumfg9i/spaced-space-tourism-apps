import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, ShieldCheck, ChevronDown, Rocket } from 'lucide-react';
import { Planet } from '../types';
import { DateChoiceSelector } from './DateChoiceSelector';

interface HeroSectionProps {
  planets: Planet[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ planets }) => {
  const navigate = useNavigate();
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('1');
  const [leavingFrom, setLeavingFrom] = useState<string>('Earth Gateway Port 04 (LEO)');
  const [departureWindow, setDepartureWindow] = useState<string>('2027-03-15');
  const [passengers, setPassengers] = useState<number>(2);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlanetId) {
      navigate(`/booking/${selectedPlanetId}?travelers=${passengers}&date=${departureWindow}`);
    } else {
      navigate('/planets');
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background with cinematic space astronaut illustration / photo & gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=2000&q=85"
          alt="Astronauts exploring extraterrestrial Martian landscape"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-110"
        />
        {/* Deep dark gradient overlays to match reference color palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/65 to-[#05070D]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/90 via-[#05070D]/40 to-[#05070D]/80" />
        {/* Subtle starfield particles grid overlay */}
        <div className="absolute inset-0 space-grid-bg opacity-30 pointer-events-none" />
      </div>

      {/* Hero Core Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-24 flex flex-col items-center text-center">
        
        {/* Sci-Fi Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1020]/90 border border-[#38D9D9]/40 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(56,217,217,0.15)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#38D9D9] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-orbitron uppercase tracking-[0.25em] text-[#38D9D9] font-bold">
            THE SAFEST WAY TO EXPLORE THE GALAXY
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] uppercase text-white leading-tight drop-shadow-2xl">
          EXPLORE THE <span className="text-[#FF5A1F] drop-shadow-[0_0_35px_rgba(255,90,31,0.5)]">GALAXY</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-[#BAC2D6] max-w-2xl font-space font-normal tracking-wide leading-relaxed">
          Experience extraordinary worlds beyond Earth. Commercial orbital voyages, cryogenic deep-space charters, and luxury surface habitats engineered for wonder.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/planets');
            }}
            className="px-8 py-3.5 rounded-sm bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs sm:text-sm font-orbitron font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,90,31,0.45)] hover:shadow-[0_0_35px_rgba(255,90,31,0.7)] flex items-center gap-2 cursor-pointer"
          >
            <span>BOOK YOUR TRIP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/planets')}
            className="px-8 py-3.5 rounded-sm bg-[#0B1020]/80 hover:bg-[#121A33] border border-[#20283A] hover:border-[#38D9D9]/60 text-[#F5F5F5] text-xs sm:text-sm font-orbitron font-bold tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"
          >
            EXPLORE PLANETS
          </button>
        </div>
      </div>

      {/* Quick Mission Search Bar (matching reference layout) */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full mt-14">
        <form
          onSubmit={handleQuickSearch}
          className="bg-[#0B1020]/90 backdrop-blur-xl border border-[#20283A] rounded-sm p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Leaving From */}
            <div className="space-y-1">
              <label className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1] flex items-center gap-1.5">
                <span>Leaving From</span>
              </label>
              <select
                value={leavingFrom}
                onChange={(e) => setLeavingFrom(e.target.value)}
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] text-white text-xs font-space px-3 py-2.5 rounded-sm outline-none transition-colors"
              >
                <option value="Earth Gateway Port 04 (LEO)">Earth Gateway Port 04 (LEO)</option>
                <option value="Lunar Gateway Station (Artemis)">Lunar Gateway Station (Artemis)</option>
                <option value="Orbital Spaceport Kennedy">Orbital Spaceport Kennedy</option>
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1]">
                Destination
              </label>
              <select
                value={selectedPlanetId}
                onChange={(e) => setSelectedPlanetId(e.target.value)}
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] text-white text-xs font-space px-3 py-2.5 rounded-sm outline-none transition-colors"
              >
                {planets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.planet_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date / Web Choice Window */}
            <DateChoiceSelector
              selectedDate={departureWindow}
              onDateChange={(newDate) => setDepartureWindow(newDate)}
              variant="compact"
              label="Launch Window"
            />

            {/* Passengers & Launch Action */}
            <div className="space-y-1 flex flex-col justify-end">
              <div className="flex justify-between text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1]">
                <span>Passengers</span>
                <span className="text-[#38D9D9] font-bold">{passengers} Traveler(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#05070D] border border-[#20283A] rounded-sm px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-7 h-7 flex items-center justify-center text-[#8B91A1] hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-orbitron font-bold text-white">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(8, passengers + 1))}
                    className="w-7 h-7 flex items-center justify-center text-[#8B91A1] hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  type="submit"
                  className="flex-1 bg-[#38D9D9] hover:bg-[#52e2e2] text-[#05070D] font-orbitron font-bold text-xs py-2.5 px-4 rounded-sm tracking-[0.15em] uppercase transition-all shadow-[0_0_15px_rgba(56,217,217,0.3)] hover:shadow-[0_0_20px_rgba(56,217,217,0.6)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>CHECK LAUNCH</span>
                </button>
              </div>
            </div>

          </div>

          {/* Cyan HUD telemetry scanline indicator */}
          <div className="mt-4 pt-3 border-t border-[#20283A]/70 flex items-center justify-between text-[10px] font-rajdhani text-[#8B91A1] tracking-widest">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#38D9D9] animate-ping" />
              <span>ORBITAL LAUNCH WINDOWS: NOMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-[#172033] rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-[#38D9D9] animate-pulse" />
              </div>
              <span className="text-[#38D9D9]">TRANSMISSION LOCK</span>
            </div>
          </div>
        </form>
      </div>

    </section>
  );
};
