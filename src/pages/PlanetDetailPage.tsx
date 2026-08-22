import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Planet, TravelPackage } from '../types';
import { DateChoiceSelector } from '../components/DateChoiceSelector';
import { 
  Orbit, 
  Thermometer, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Globe, 
  Wind, 
  Activity, 
  Check, 
  ChevronLeft,
  Calendar
} from 'lucide-react';

export const PlanetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2027-03-15');
  const [travelers, setTravelers] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [planetData, packagesData] = await Promise.all([
          api.getPlanetById(id),
          api.getPackages(),
        ]);
        setPlanet(planetData);
        setPackages(packagesData);
      } catch (err: unknown) {
        console.error('Error loading planet:', err);
        setError('Could not retrieve planet telemetry profile.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-[#38D9D9] animate-spin" />
      </div>
    );
  }

  if (error || !planet) {
    return (
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h2 className="font-orbitron text-2xl text-white mb-2">TARGET CELESTIAL BODY NOT FOUND</h2>
        <p className="text-sm text-[#8B91A1] mb-6">{error || 'Unknown coordinates.'}</p>
        <Link
          to="/planets"
          className="px-6 py-2.5 bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase rounded-sm"
        >
          RETURN TO PLANETS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/planets"
          className="inline-flex items-center gap-2 text-xs font-orbitron text-[#8B91A1] hover:text-[#38D9D9] mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK TO CELESTIAL WORLDS</span>
        </Link>

        {/* Hero Banner for Selected Planet */}
        <div className="relative rounded-sm border border-[#20283A] bg-[#0B1020] overflow-hidden p-6 sm:p-10 mb-12 shadow-2xl hud-corner">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xs bg-[#38D9D9]/20 border border-[#38D9D9]/50 text-[#38D9D9] text-xs font-orbitron font-bold uppercase tracking-widest">
                  {planet.planet_type}
                </span>
                <span className="text-xs font-rajdhani text-[#8B91A1] tracking-widest uppercase">
                  COORDINATES: {planet.distance_from_earth} FROM LEO
                </span>
              </div>

              <h1 className="font-orbitron font-black text-4xl sm:text-6xl uppercase tracking-[0.06em] text-white">
                {planet.name}
              </h1>

              {planet.tagline && (
                <p className="text-sm font-rajdhani text-[#FF5A1F] font-bold uppercase tracking-widest">
                  {planet.tagline}
                </p>
              )}

              <p className="text-sm sm:text-base text-[#BAC2D6] font-space leading-relaxed">
                {planet.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#20283A]">
                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase text-[#8B91A1] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#38D9D9]" />
                    <span>TRAVEL TIME</span>
                  </div>
                  <div className="font-orbitron font-bold text-sm text-white">{planet.travel_time}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase text-[#8B91A1] flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-[#FF5A1F]" />
                    <span>TEMPERATURE</span>
                  </div>
                  <div className="font-orbitron font-bold text-sm text-white">{planet.temperature}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase text-[#8B91A1] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#38D9D9]" />
                    <span>GRAVITY</span>
                  </div>
                  <div className="font-orbitron font-bold text-sm text-white">{planet.gravity}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-orbitron uppercase text-[#8B91A1] flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#FF5A1F]" />
                    <span>MISSION DURATION</span>
                  </div>
                  <div className="font-orbitron font-bold text-sm text-white">{planet.mission_duration}</div>
                </div>
              </div>

              {/* Launch Window Date Web Choice Selection */}
              <div className="pt-2">
                <DateChoiceSelector
                  selectedDate={selectedDate}
                  onDateChange={(newDate) => setSelectedDate(newDate)}
                  variant="compact"
                  label="Target Departure Window"
                />
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigate(`/booking/${planet.id}?date=${selectedDate}&travelers=${travelers}`)}
                  className="px-8 py-3.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_30px_rgba(255,90,31,0.7)] flex items-center gap-2 cursor-pointer"
                >
                  <span>CONFIGURE EXPEDITION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hologram Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_60px_rgba(56,217,217,0.3)]">
                <img
                  src={planet.image_url}
                  alt={planet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter contrast-125 brightness-95"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_50px_rgba(0,0,0,0.9)]" />
                <div className="absolute inset-0 rounded-full shadow-[inset_20px_20px_35px_rgba(255,255,255,0.2)]" />
              </div>
            </div>

          </div>
        </div>

        {/* Available Travel Tier Packages */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-6 bg-[#38D9D9]" />
            <h2 className="font-orbitron font-bold text-2xl uppercase tracking-wider text-white">
              AVAILABLE EXPEDITION TIERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              let featuresList: string[] = [];
              try {
                if (pkg.features) featuresList = JSON.parse(pkg.features);
              } catch (e) {
                featuresList = ['Full life support suite', 'Orbital crew assistance'];
              }

              return (
                <div
                  key={pkg.id}
                  className="bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9] p-6 rounded-sm flex flex-col justify-between space-y-6 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-orbitron font-black text-xl text-white group-hover:text-[#38D9D9] transition-colors">
                        {pkg.name}
                      </span>
                      <span className="text-xs font-orbitron text-[#FF5A1F] font-bold">
                        +₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B91A1] font-space leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="space-y-2 pt-2 border-t border-[#20283A]">
                      {featuresList.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#BAC2D6] font-space">
                          <Check className="w-3.5 h-3.5 text-[#38D9D9] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/booking/${planet.id}?package=${pkg.id}&date=${selectedDate}&travelers=${travelers}`)}
                    className="w-full py-2.5 bg-[#05070D] border border-[#20283A] hover:border-[#FF5A1F] hover:bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all"
                  >
                    SELECT {pkg.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
