import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Planet, Testimonial, Stats } from '../types';
import { HeroSection } from '../components/HeroSection';
import { AboutPioneeringSection } from '../components/AboutPioneeringSection';
import { BioSuitSection } from '../components/BioSuitSection';
import { PlanetExplorer } from '../components/PlanetExplorer';
import { TransmissionAndLogsSection } from '../components/TransmissionAndLogsSection';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [planetsData, testimonialsData] = await Promise.all([
          api.getPlanets(),
          api.getTestimonials(),
        ]);
        setPlanets(planetsData);
        setTestimonials(testimonialsData);
      } catch (err: unknown) {
        console.error('Failed to load home page telemetry:', err);
        setError('Failed to establish database telemetry link.');
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#38D9D9] animate-spin" />
        <div className="text-xs font-orbitron tracking-[0.25em] text-[#8B91A1] uppercase">
          INITIALIZING TELEMETRY LINK...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D]">
      {/* 1. Cinematic Hero Section */}
      <HeroSection planets={planets} />

      {/* 2. Pioneering About & Stats Section */}
      <AboutPioneeringSection />

      {/* 3. Bio Suit 2.0 Equipment Section */}
      <BioSuitSection />

      {/* 4. OTHER WORLDS Dynamic Planet Explorer */}
      <PlanetExplorer planets={planets} />

      {/* 5. Transmissions and Passenger Logs */}
      <TransmissionAndLogsSection testimonials={testimonials} />
    </div>
  );
};
