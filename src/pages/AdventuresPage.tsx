import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Planet } from '../types';
import { DateChoiceSelector } from '../components/DateChoiceSelector';
import { Compass, Sparkles, Shield, Rocket, ArrowRight, Activity, Calendar } from 'lucide-react';

export const AdventuresPage: React.FC = () => {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2027-03-15');

  useEffect(() => {
    api.getPlanets().then(setPlanets).catch(console.error);
  }, []);

  const adventuresList = [
    {
      title: 'Olympus Mons Caldera Ascent',
      planetId: 1,
      planetName: 'Mars',
      duration: '90 Days',
      difficulty: 'Moderate Exo-Climbing',
      tag: 'VOLCANIC RIDGE',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80',
      description: 'Ascend the solar system’s tallest planetary shield volcano standing 21.9 km above the Martian plains with pressurized high-altitude exo-harnesses.',
    },
    {
      title: 'Europa Sub-Surface Deep Dive',
      planetId: 3,
      planetName: 'Europa',
      duration: '180 Days',
      difficulty: 'Advanced Cryo-Marine',
      tag: 'OCEANIC ABYSS',
      image: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=1000&q=80',
      description: 'Maneuver high-tech nuclear-powered submersibles under 15 km of protective surface ice to explore alien hydrothermal vents.',
    },
    {
      title: 'Titan Winged Methane Sailing',
      planetId: 4,
      planetName: 'Titan',
      duration: '240 Days',
      difficulty: 'Accessible Low-G Aerobatics',
      tag: 'ATMOSPHERIC GLIDE',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80',
      description: 'Equip mechanical human wings to fly effortlessly through Titan’s thick nitrogen atmosphere under the majestic amber rings of Saturn.',
    },
    {
      title: 'Lunar Earthrise Horizon Walk',
      planetId: 2,
      planetName: 'Moon',
      duration: '7 Days',
      difficulty: 'Beginner Low-G Leisure',
      tag: 'ORBITAL RETREAT',
      image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1000&q=80',
      description: 'A tranquil low-gravity walk across the Sea of Tranquility while witnessing the luminous blue Earth rise above the lunar rim.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1020] border border-[#FF5A1F]/30 text-[#FF5A1F] text-[10px] font-orbitron font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>CURATED EXPEDITIONS & SURFACE MISSIONS</span>
          </div>
          <h1 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-[0.06em] text-white">
            SPACE <span className="text-[#38D9D9]">ADVENTURES</span>
          </h1>
          <p className="mt-3 text-sm text-[#8B91A1] font-space">
            Select specialized surface excursions and orbital activities designed for thrill-seekers, explorers, and interstellar pioneers.
          </p>
        </div>

        {/* Global Departure Window Selector for Adventures */}
        <div className="max-w-xl mx-auto mb-12 bg-[#0B1020] border border-[#20283A] p-4 rounded-sm">
          <DateChoiceSelector
            selectedDate={selectedDate}
            onDateChange={(newDate) => setSelectedDate(newDate)}
            variant="compact"
            label="Preferred Mission Departure Window"
          />
        </div>

        {/* Adventure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adventuresList.map((adv, idx) => (
            <div
              key={idx}
              className="bg-[#0B1020] border border-[#20283A] hover:border-[#FF5A1F]/60 rounded-sm overflow-hidden flex flex-col justify-between transition-all group hud-corner"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#070A14]">
                <img
                  src={adv.image}
                  alt={adv.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-[#05070D]/85 border border-[#38D9D9]/40 text-[#38D9D9] text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-xs tracking-widest">
                  {adv.tag}
                </div>
                <div className="absolute bottom-3 right-3 text-xs font-orbitron text-white bg-[#05070D]/80 px-2.5 py-1 rounded-xs border border-[#20283A]">
                  WORLD: {adv.planetName.toUpperCase()}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-xl text-white uppercase group-hover:text-[#FF5A1F] transition-colors">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-[#BAC2D6] font-space mt-2 leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#20283A] flex items-center justify-between text-[11px] font-rajdhani text-[#8B91A1] uppercase tracking-wider">
                  <span>DURATION: {adv.duration}</span>
                  <span className="text-[#38D9D9]">{adv.difficulty}</span>
                </div>

                <button
                  onClick={() => navigate(`/booking/${adv.planetId}?date=${selectedDate}`)}
                  className="w-full py-3 bg-[#05070D] border border-[#20283A] hover:border-[#FF5A1F] hover:bg-[#FF5A1F] text-white text-xs font-orbitron font-bold tracking-widest uppercase rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>BOOK MISSION EXPEDITION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

