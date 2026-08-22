import React, { useState } from 'react';
import { Eye, Wind, Feather, ShieldCheck, Thermometer, Radio, Cpu, Sparkles } from 'lucide-react';
import bioSuitImg from '../assets/images/bio_suit_prototype_1787414939289.jpg';

export const BioSuitSection: React.FC = () => {
  const [activeSpec, setActiveSpec] = useState<number>(0);

  const suitSpecs = [
    {
      title: '50% LIGHTER',
      icon: Feather,
      subtitle: 'Carbon-Nanotube Matrix',
      description: 'Advanced carbon-weave materials reduce fatigue during extravehicular activities while preserving maximum tensile barrier strength.',
      color: '#38D9D9'
    },
    {
      title: 'HUD CONTROLS',
      icon: Eye,
      subtitle: 'Neural & Retinal Tracking',
      description: 'Retinal tracking and augmented reality visor interface for completely hands-free environmental and life-support telemetry management.',
      color: '#FF5A1F'
    },
    {
      title: '08HS OXYGEN',
      icon: Wind,
      subtitle: 'Closed-Loop Rebreather',
      description: 'Extended molecular scrubber system recycle 99.8% of atmospheric vapor, enabling 8+ hour planetary surface excursions without tether.',
      color: '#38D9D9'
    },
    {
      title: 'THERMAL SHIELD',
      icon: Thermometer,
      subtitle: '-180°C TO 120°C RATED',
      description: 'Multi-layer aerogel insulation shields against vacuum cold, solar radiation spikes, and micro-meteorite abrasions.',
      color: '#FF5A1F'
    }
  ];

  return (
    <section className="py-24 bg-[#070A14] border-y border-[#20283A]/60 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,217,217,0.08),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-[#38D9D9]" />
            <span className="text-xs font-orbitron uppercase tracking-[0.3em] text-[#38D9D9] font-bold">
              EQUIPMENT
            </span>
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.05em] text-white">
            BIO SUIT <span className="text-[#38D9D9]">2.0</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8B91A1] max-w-2xl font-space">
            Engineered for extreme environments. Our proprietary Exosuit technology provides maximum mobility with integrated life-support and AR telemetry systems.
          </p>
        </div>

        {/* Two Column Layout: Specifications & Render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Spec Feature Cards */}
          <div className="lg:col-span-6 space-y-4">
            {suitSpecs.map((spec, index) => {
              const Icon = spec.icon;
              const isSelected = activeSpec === index;
              return (
                <div
                  key={spec.title}
                  onClick={() => setActiveSpec(index)}
                  className={`p-4 sm:p-5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1020] border-[#38D9D9]/80 shadow-[0_0_20px_rgba(56,217,217,0.12)] hud-corner'
                      : 'bg-[#0B1020]/40 border-[#20283A] hover:border-[#2E3B57] hover:bg-[#0B1020]/70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: isSelected ? 'rgba(56, 217, 217, 0.15)' : '#05070D',
                        borderColor: isSelected ? spec.color : '#20283A'
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: spec.color }} />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wider">
                          {spec.title}
                        </span>
                        <span className="text-[10px] font-rajdhani uppercase tracking-widest text-[#38D9D9]">
                          {spec.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#BAC2D6] font-space leading-relaxed">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High-Tech Space Suit Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-sm overflow-hidden border border-[#20283A] bg-[#05070D] hud-corner p-3 shadow-2xl">
              
              {/* Suit Image Card */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xs bg-[#090D1A]">
                <img
                  src={bioSuitImg}
                  alt="SPACED Bio Suit 2.0 Prototype in Airlock"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter contrast-110 brightness-95"
                />

                {/* Cyber HUD Watermark Top-Left */}
                <div className="absolute top-3 left-3 bg-[#05070D]/85 border border-[#38D9D9]/40 backdrop-blur-md px-3 py-1.5 rounded-sm">
                  <div className="text-[9px] font-orbitron font-bold text-white tracking-widest uppercase">
                    SPACED
                  </div>
                  <div className="text-[8px] font-rajdhani text-[#38D9D9] tracking-widest uppercase">
                    Beyond Earth • Bio-Suit Experience
                  </div>
                </div>

                {/* Status indicator bottom */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#05070D]/90 border border-[#20283A] backdrop-blur-md p-3 rounded-sm flex items-center justify-between text-[10px] font-orbitron">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#38D9D9]" />
                    <span className="text-white">STATUS: FLIGHT CERTIFIED</span>
                  </div>
                  <div className="text-[#FF5A1F] font-bold">
                    NASA & ESA COMPLIANT
                  </div>
                </div>

                {/* Target reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-[#38D9D9]/30 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-ping" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
