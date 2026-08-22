import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Planet } from '../types';
import { DateChoiceSelector } from './DateChoiceSelector';
import { 
  Compass, 
  Orbit, 
  Thermometer, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  Sparkles,
  Layers,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface PlanetExplorerProps {
  planets: Planet[];
}

export const PlanetExplorer: React.FC<PlanetExplorerProps> = ({ planets }) => {
  const navigate = useNavigate();
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number>(0);
  const [travelers, setTravelers] = useState<number>(2);
  const [departureDate, setDepartureDate] = useState<string>('2027-03-15');

  if (!planets || planets.length === 0) {
    return null;
  }

  const currentPlanet = planets[selectedPlanetIndex] || planets[0];

  const handleBookExpedition = () => {
    navigate(`/booking/${currentPlanet.id}?travelers=${travelers}&date=${departureDate}`);
  };

  return (
    <section id="explore" className="py-24 bg-[#05070D] relative overflow-hidden">
      {/* Subtle Star Grid Background */}
      <div className="absolute inset-0 space-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-[0.15em] text-[#FF5A1F] drop-shadow-[0_0_25px_rgba(255,90,31,0.3)]">
            OTHER WORLDS
          </h2>
          <div className="w-[2px] h-8 bg-[#FF5A1F] mx-auto mt-3" />
        </div>

        {/* Outer Exploration Container */}
        <div className="border border-[#20283A] bg-[#070B18]/90 rounded-sm p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 1. Left Vertical Planet Selector */}
            <div className="lg:col-span-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 border-b lg:border-b-0 lg:border-r border-[#20283A] lg:pr-4">
              <div className="hidden lg:block text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1] mb-2 px-2">
                WORLDS SELECTOR
              </div>
              {planets.map((planet, index) => {
                const isActive = index === selectedPlanetIndex;
                return (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanetIndex(index)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-left transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1020] border-l-2 border-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.15)]'
                        : 'text-[#8B91A1] hover:text-white hover:bg-[#0B1020]/40'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-[#FF5A1F] shadow-[0_0_8px_#FF5A1F]' : 'bg-[#20283A]'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="font-orbitron font-bold text-xs uppercase tracking-wider">
                        {planet.name}
                      </span>
                      <span className="text-[9px] font-rajdhani text-[#8B91A1] uppercase tracking-widest hidden sm:inline">
                        {planet.planet_type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. Center Planet Visual & Holographic Framed Viewport */}
            <div className="lg:col-span-5 relative flex items-center justify-center p-4">
              <div className="relative w-full max-w-[380px] aspect-square rounded-sm border border-[#20283A] bg-[#05070D] hud-corner p-4 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
                
                {/* HUD Telemetry Top Details */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[8px] font-orbitron text-[#8B91A1] tracking-widest uppercase">
                  <span>ORBITAL SECTOR 09</span>
                  <span className="text-[#38D9D9]">SCAN: COMPLETE</span>
                </div>

                {/* Outer Orbit Rings */}
                <div className="absolute inset-8 rounded-full border border-[#38D9D9]/20 border-dashed animate-spin [animation-duration:60s] pointer-events-none" />
                <div className="absolute inset-14 rounded-full border border-[#FF5A1F]/20 pointer-events-none" />

                {/* Holographic Glowing Celestial Sphere */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_0_50px_rgba(56,217,217,0.25)] group">
                  <img
                    src={currentPlanet.image_url}
                    alt={currentPlanet.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter contrast-125 brightness-95 transform transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Planet Atmosphere Glow Overlay */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-25px_-25px_40px_rgba(0,0,0,0.9)]" />
                  <div className="absolute inset-0 rounded-full shadow-[inset_15px_15px_30px_rgba(255,255,255,0.15)]" />
                </div>

                {/* HUD Coordinates Bottom Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[8px] font-rajdhani text-[#8B91A1] tracking-widest uppercase border-t border-[#20283A]/60 pt-2">
                  <span>ATMOSPHERE: {currentPlanet.atmosphere.slice(0, 15)}...</span>
                  <span className="text-[#FF5A1F]">GRAVITY: {currentPlanet.gravity}</span>
                </div>

              </div>
            </div>

            {/* 3. Right Details & Expedition Booking Card (matching reference) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Classification Tag & Distance */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xs bg-[#38D9D9]/15 border border-[#38D9D9]/40 text-[#38D9D9] text-[10px] font-orbitron font-bold uppercase tracking-widest">
                  {currentPlanet.planet_type}
                </span>
                <span className="text-xs font-rajdhani font-bold text-[#8B91A1] tracking-widest uppercase">
                  DIST: {currentPlanet.distance_from_earth}
                </span>
              </div>

              {/* Planet Title */}
              <div>
                <h3 className="font-orbitron font-black text-4xl sm:text-5xl uppercase tracking-[0.06em] text-white">
                  {currentPlanet.name}
                </h3>
                {currentPlanet.tagline && (
                  <p className="text-xs font-rajdhani text-[#38D9D9] uppercase tracking-widest mt-1">
                    {currentPlanet.tagline}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#BAC2D6] font-space leading-relaxed">
                {currentPlanet.description}
              </p>

              {/* Planetary Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#20283A]">
                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase tracking-widest text-[#8B91A1] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#38D9D9]" />
                    <span>TRAVEL TIME</span>
                  </div>
                  <div className="font-orbitron font-black text-lg sm:text-xl text-white">
                    {currentPlanet.travel_time}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase tracking-widest text-[#8B91A1] flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-[#FF5A1F]" />
                    <span>BASE TEMP</span>
                  </div>
                  <div className="font-orbitron font-black text-lg sm:text-xl text-white">
                    {currentPlanet.temperature}
                  </div>
                </div>
              </div>

              {/* Departure Window Web Choice Selection */}
              <div className="pt-3 border-t border-[#20283A]">
                <DateChoiceSelector
                  selectedDate={departureDate}
                  onDateChange={(newDate) => setDepartureDate(newDate)}
                  variant="compact"
                  label="Mission Departure Window"
                />
              </div>

              {/* Traveler Counter and Book Expedition Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                
                {/* Traveler Counter */}
                <div className="flex items-center justify-between sm:justify-center bg-[#0B1020] border border-[#20283A] rounded-sm px-3 py-2">
                  <span className="sm:hidden text-[10px] font-orbitron uppercase text-[#8B91A1]">Travelers:</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#8B91A1] hover:text-white text-lg font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-orbitron font-bold text-base text-white">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(8, travelers + 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#8B91A1] hover:text-white text-lg font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Glowing Orange Book Expedition CTA */}
                <button
                  onClick={handleBookExpedition}
                  className="flex-1 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs sm:text-sm py-3.5 px-6 rounded-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_30px_rgba(255,90,31,0.7)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>BOOK EXPEDITION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
