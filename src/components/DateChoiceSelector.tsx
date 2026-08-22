import React, { useState } from 'react';
import { Calendar, Sparkles, Clock, CheckCircle2, ChevronDown, Rocket, Compass } from 'lucide-react';

export interface LaunchWindowOption {
  id: string;
  label: string;
  date: string;
  season: string;
  trajectory: 'Optimal' | 'Fast Transit' | 'Super Economy' | 'Deep Slingshot';
  efficiency: string;
  badgeColor: string;
  description: string;
}

export const LAUNCH_WINDOWS: LaunchWindowOption[] = [
  {
    id: 'w1',
    label: 'Q4 2026 Perseid Alignment',
    date: '2026-11-18',
    season: 'Autumn 2026',
    trajectory: 'Optimal',
    efficiency: '99.4% Fuel Sync',
    badgeColor: 'border-[#38D9D9] text-[#38D9D9] bg-[#38D9D9]/10',
    description: 'Minimal radiation exposure corridor with high atmospheric braking safety.'
  },
  {
    id: 'w2',
    label: 'Spring 2027 Hohmann Window',
    date: '2027-03-15',
    season: 'Spring 2027',
    trajectory: 'Fast Transit',
    efficiency: '-18% Travel Time',
    badgeColor: 'border-[#FF5A1F] text-[#FF5A1F] bg-[#FF5A1F]/10',
    description: 'High-thrust ion drive alignment with orbital lunar gravitational slingshot.'
  },
  {
    id: 'w3',
    label: 'Summer 2027 Solstice Expedition',
    date: '2027-06-22',
    season: 'Summer 2027',
    trajectory: 'Optimal',
    efficiency: '98.1% Fuel Sync',
    badgeColor: 'border-[#38D9D9] text-[#38D9D9] bg-[#38D9D9]/10',
    description: 'Direct planetary conjunction with maximum solar array recharge efficiency.'
  },
  {
    id: 'w4',
    label: 'Autumn 2027 Solar Minimum',
    date: '2027-10-10',
    season: 'Autumn 2027',
    trajectory: 'Super Economy',
    efficiency: 'Zero Solar Storms',
    badgeColor: 'border-emerald-400 text-emerald-400 bg-emerald-400/10',
    description: 'Calm interplanetary heliosphere ideal for sensitive scientific cargo and families.'
  },
  {
    id: 'w5',
    label: 'Spring 2028 Conjunction Gateway',
    date: '2028-04-18',
    season: 'Spring 2028',
    trajectory: 'Deep Slingshot',
    efficiency: 'Exoplanet Range',
    badgeColor: 'border-purple-400 text-purple-400 bg-purple-400/10',
    description: 'Jupiter gravitational assist corridor for outer rim and deep cryogenic voyages.'
  }
];

interface DateChoiceSelectorProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  variant?: 'compact' | 'card' | 'dropdown';
  label?: string;
  minDate?: string;
  maxDate?: string;
  showTelemetry?: boolean;
}

export const DateChoiceSelector: React.FC<DateChoiceSelectorProps> = ({
  selectedDate,
  onDateChange,
  variant = 'card',
  label = 'Orbital Launch Window Date',
  minDate = '2026-09-01',
  maxDate = '2028-12-31',
  showTelemetry = true
}) => {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !LAUNCH_WINDOWS.some((w) => w.date === selectedDate)
  );
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  // Determine current active preset if any
  const matchedWindow = LAUNCH_WINDOWS.find((w) => w.date === selectedDate);

  const calculateDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format date display nicely
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Variant: COMPACT (for hero bar & search forms)
  if (variant === 'compact') {
    return (
      <div className="space-y-1 relative">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#38D9D9]" />
            <span>{label}</span>
          </label>
          {matchedWindow && (
            <span className="text-[9px] font-rajdhani text-[#38D9D9] uppercase font-bold tracking-wider">
              {matchedWindow.trajectory}
            </span>
          )}
        </div>

        <div className="relative">
          <select
            value={matchedWindow ? matchedWindow.date : 'custom'}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomMode(true);
              } else {
                setIsCustomMode(false);
                onDateChange(e.target.value);
              }
            }}
            className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] text-white text-xs font-space px-3 py-2.5 rounded-sm outline-none transition-colors appearance-none cursor-pointer"
          >
            <optgroup label="🌟 Curated Orbital Windows">
              {LAUNCH_WINDOWS.map((win) => (
                <option key={win.id} value={win.date}>
                  {win.label} ({formatDateDisplay(win.date)})
                </option>
              ))}
            </optgroup>
            <option value="custom">📅 Custom Date Specification...</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1] pointer-events-none" />
        </div>

        {isCustomMode && (
          <div className="mt-2 animate-in fade-in duration-200">
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-[#05070D] border border-[#38D9D9]/70 focus:border-[#38D9D9] text-white text-xs font-space px-3 py-2 rounded-sm outline-none shadow-[0_0_10px_rgba(56,217,217,0.15)]"
            />
          </div>
        )}
      </div>
    );
  }

  // Variant: CARD / FULL INTERACTIVE (for Booking Page & Planet Details)
  return (
    <div className="space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20283A] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#38D9D9]" />
          <span className="font-orbitron font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
            {label}
          </span>
        </div>

        {/* Mode Buttons */}
        <div className="inline-flex rounded-sm bg-[#05070D] border border-[#20283A] p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              if (!matchedWindow) {
                onDateChange(LAUNCH_WINDOWS[0].date);
              }
            }}
            className={`px-3 py-1 rounded-xs text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !isCustomMode
                ? 'bg-[#FF5A1F] text-white shadow-[0_0_10px_rgba(255,90,31,0.4)]'
                : 'text-[#8B91A1] hover:text-white'
            }`}
          >
            Curated Windows
          </button>
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1 rounded-xs text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isCustomMode
                ? 'bg-[#38D9D9] text-[#05070D] shadow-[0_0_10px_rgba(56,217,217,0.4)]'
                : 'text-[#8B91A1] hover:text-white'
            }`}
          >
            Custom Date
          </button>
        </div>
      </div>

      {/* Mode 1: Curated Launch Windows Web Choice Grid */}
      {!isCustomMode ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LAUNCH_WINDOWS.map((win) => {
              const isSelected = selectedDate === win.date;
              return (
                <div
                  key={win.id}
                  onClick={() => onDateChange(win.date)}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-[#0E1528] border-[#38D9D9] shadow-[0_0_20px_rgba(56,217,217,0.25)] ring-1 ring-[#38D9D9]/50'
                      : 'bg-[#05070D] border-[#20283A] hover:border-[#2E3B57] hover:bg-[#070B18]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-rajdhani uppercase text-[#8B91A1] tracking-wider">
                        {win.season}
                      </div>
                      <div className="font-orbitron font-bold text-xs sm:text-sm text-white">
                        {win.label}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#38D9D9] shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-orbitron font-bold uppercase px-2 py-0.5 rounded-xs border ${win.badgeColor}`}
                    >
                      {win.trajectory}
                    </span>
                    <span className="text-[10px] font-space text-[#BAC2D6]">
                      {win.efficiency}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#20283A]/80 flex items-center justify-between text-[10px] font-orbitron">
                    <span className="text-[#8B91A1]">LAUNCH:</span>
                    <span className="text-white font-bold">
                      {formatDateDisplay(win.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional details for selected window */}
          {matchedWindow && showTelemetry && (
            <div className="p-3 bg-[#070B18] border border-[#38D9D9]/30 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#38D9D9] font-orbitron text-[11px]">
                <Rocket className="w-3.5 h-3.5 animate-pulse" />
                <span>SELECTED WINDOW: {matchedWindow.label.toUpperCase()}</span>
              </div>
              <div className="text-[#8B91A1] font-space text-[11px]">
                {matchedWindow.description}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Custom Date Picker and Quick Offset Controls */
        <div className="bg-[#05070D] border border-[#20283A] p-4 rounded-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron uppercase tracking-wider text-[#8B91A1]">
                Select Custom Departure Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#38D9D9]/70 focus:border-[#38D9D9] px-3 py-2.5 text-xs font-space text-white rounded-sm outline-none shadow-[0_0_15px_rgba(56,217,217,0.15)]"
                required
              />
            </div>

            {/* Quick Web Preset Jumps */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron uppercase tracking-wider text-[#8B91A1]">
                Quick Calendar Preset Options
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '+30 Days', days: 30 },
                  { label: '+90 Days (Next Quarter)', days: 90 },
                  { label: '+180 Days (Optimal Sync)', days: 180 },
                  { label: '+1 Year', days: 365 }
                ].map((preset, i) => {
                  const target = new Date();
                  target.setDate(target.getDate() + preset.days);
                  const dateStr = target.toISOString().split('T')[0];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onDateChange(dateStr)}
                      className="px-2.5 py-1 rounded-xs bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9] text-[#BAC2D6] hover:text-white text-[10px] font-orbitron tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Custom Date Telemetry */}
          {showTelemetry && selectedDate && (
            <div className="pt-3 border-t border-[#20283A] flex flex-wrap items-center justify-between gap-3 text-[11px] font-space text-[#8B91A1]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>
                  LAUNCH TARGET:{' '}
                  <strong className="text-white font-orbitron">
                    {formatDateDisplay(selectedDate)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#38D9D9] font-orbitron">
                  {calculateDaysRemaining(selectedDate)} DAYS REMAINING UNTIL ORBITAL INSERTION
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
