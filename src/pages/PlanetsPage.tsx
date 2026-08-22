import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Planet } from '../types';
import { DateChoiceSelector, LAUNCH_WINDOWS } from '../components/DateChoiceSelector';
import { 
  Search, 
  Filter, 
  Orbit, 
  Thermometer, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Compass,
  Calendar
} from 'lucide-react';

export const PlanetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('2027-03-15');

  useEffect(() => {
    async function fetchPlanets() {
      try {
        const data = await api.getPlanets();
        setPlanets(data);
      } catch (e) {
        console.error('Failed to load planets:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPlanets();
  }, []);

  const types = ['ALL', 'TERRESTRIAL', 'LUNAR SATELLITE', 'OCEANIC MOON', 'HYDROCARBON MOON', 'CLOUD METROPOLIS', 'EXOPLANET'];

  const filteredPlanets = planets.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || p.planet_type.toUpperCase().includes(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1020] border border-[#38D9D9]/30 text-[#38D9D9] text-[10px] font-orbitron font-bold uppercase tracking-widest mb-3">
            <Orbit className="w-3.5 h-3.5" />
            <span>SOLAR SYSTEM & EXOPLANETARY ARCHIVE</span>
          </div>
          <h1 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-[0.06em] text-white">
            CELESTIAL <span className="text-[#FF5A1F]">WORLDS</span>
          </h1>
          <p className="mt-3 text-sm text-[#8B91A1] font-space">
            Browse our catalog of chartered expeditions. From short lunar weekend retreats to multi-year deep cryogenic exoplanet odysseys.
          </p>
        </div>

        {/* Search & Date Filter Controls */}
        <div className="bg-[#0B1020] border border-[#20283A] p-4 sm:p-5 rounded-sm mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
              <input
                type="text"
                placeholder="Search planet name, geology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] pl-9 pr-4 py-2 text-xs font-space text-white rounded-sm outline-none transition-colors"
              />
            </div>

            {/* Launch Date Web Choice Selector in filter bar */}
            <div className="w-full lg:w-auto flex-1 max-w-md">
              <DateChoiceSelector
                selectedDate={selectedDate}
                onDateChange={(newDate) => setSelectedDate(newDate)}
                variant="compact"
                label="Filter by Orbital Departure Window"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-2 border-t border-[#20283A] flex items-center gap-2 overflow-x-auto w-full pb-1">
            <span className="text-[10px] font-orbitron uppercase text-[#8B91A1] tracking-wider shrink-0 mr-1">
              Filter by Type:
            </span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-orbitron font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-[#FF5A1F] text-white shadow-[0_0_10px_rgba(255,90,31,0.4)]'
                    : 'bg-[#05070D] text-[#8B91A1] hover:text-white border border-[#20283A]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Planets Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#38D9D9] animate-spin" />
            <span className="text-xs font-orbitron tracking-widest text-[#8B91A1]">
              LOADING PLANETARY CATALOG...
            </span>
          </div>
        ) : filteredPlanets.length === 0 ? (
          <div className="py-20 text-center text-[#8B91A1] font-space text-sm">
            No celestial bodies matched your current search filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlanets.map((planet) => (
              <div
                key={planet.id}
                className="bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9]/70 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_25px_rgba(56,217,217,0.15)] hud-corner"
              >
                {/* Planet Image & Telemetry overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#070A14]">
                  <img
                    src={planet.image_url}
                    alt={planet.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-80" />
                  
                  {/* Top tags */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 rounded-xs bg-[#05070D]/85 border border-[#38D9D9]/40 text-[#38D9D9] text-[9px] font-orbitron font-bold uppercase tracking-widest">
                      {planet.planet_type}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] font-orbitron text-white bg-[#05070D]/80 px-2 py-1 rounded-xs border border-[#20283A]">
                    FROM ₹{planet.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-orbitron font-bold text-2xl text-white uppercase group-hover:text-[#38D9D9] transition-colors">
                      {planet.name}
                    </h3>
                    <p className="text-xs text-[#BAC2D6] font-space line-clamp-2 mt-2 leading-relaxed">
                      {planet.description}
                    </p>
                  </div>

                  {/* Spec Row */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#20283A] text-[10px] font-orbitron">
                    <div className="flex items-center gap-1.5 text-[#8B91A1]">
                      <Clock className="w-3 h-3 text-[#38D9D9]" />
                      <span>{planet.travel_time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8B91A1]">
                      <Thermometer className="w-3 h-3 text-[#FF5A1F]" />
                      <span>{planet.temperature}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={`/planets/${planet.id}`}
                      className="flex-1 text-center py-2.5 bg-[#05070D] border border-[#20283A] hover:border-[#38D9D9] text-[#F5F5F5] text-xs font-orbitron font-bold tracking-wider uppercase rounded-sm transition-colors"
                    >
                      DETAILS
                    </Link>
                    <Link
                      to={`/booking/${planet.id}?date=${selectedDate}`}
                      className="flex-1 text-center py-2.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold tracking-wider uppercase rounded-sm transition-all shadow-[0_0_12px_rgba(255,90,31,0.3)] hover:shadow-[0_0_18px_rgba(255,90,31,0.5)]"
                    >
                      BOOK
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

