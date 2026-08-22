import React, { useState } from 'react';
import { Testimonial } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Star, Radio, CheckCircle, AlertCircle } from 'lucide-react';

interface TransmissionAndLogsSectionProps {
  testimonials: Testimonial[];
}

export const TransmissionAndLogsSection: React.FC<TransmissionAndLogsSectionProps> = ({ testimonials }) => {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !email || !message) {
      setErrorMsg('Please complete all transmission parameters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.sendMessage({
        sender_name: senderName,
        email,
        subject: 'General Interplanetary Transmission',
        message,
        userId: user?.id,
      });

      setSuccessMsg('Transmission logged successfully into orbital database archives.');
      setMessage('');
      if (!user) {
        setSenderName('');
        setEmail('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transmission broadcast failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-[#05070D] border-t border-[#20283A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: TRANSMISSION - SEND A MESSAGE */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header Tag */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-8 bg-[#FF5A1F]" />
                <span className="text-xs font-orbitron uppercase tracking-[0.3em] text-[#FF5A1F] font-bold">
                  TRANSMISSION
                </span>
              </div>
              <h2 className="font-orbitron font-black text-3xl sm:text-4xl uppercase tracking-[0.05em] text-white">
                SEND A <span className="text-[#38D9D9]">MESSAGE</span>
              </h2>
            </div>

            {/* Transmission Form */}
            <form
              onSubmit={handleTransmit}
              className="bg-[#0B1020]/90 border border-[#20283A] p-6 rounded-sm space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hud-corner"
            >
              {/* ComLink ID (Name) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1]">
                  ComLink ID [Name]
                </label>
                <input
                  type="text"
                  placeholder="Enter your designation"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-[#05070D] border-b border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-sm text-white font-space outline-none transition-colors"
                />
              </div>

              {/* Frequency (Email) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1]">
                  Frequency [Email]
                </label>
                <input
                  type="email"
                  placeholder="Enter your sub-space email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#05070D] border-b border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-sm text-white font-space outline-none transition-colors"
                />
              </div>

              {/* Message Payload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-orbitron uppercase tracking-[0.2em] text-[#8B91A1]">
                  Message Payload
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your transmission query here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] p-3 text-sm text-white font-space outline-none transition-colors resize-none rounded-sm"
                />
              </div>

              {/* Status messages */}
              {successMsg && (
                <div className="p-3 bg-[#38D9D9]/10 border border-[#38D9D9]/30 rounded-sm flex items-center gap-2 text-xs font-space text-[#38D9D9]">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-sm flex items-center gap-2 text-xs font-space text-[#FF5A1F]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Transmit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold tracking-[0.2em] uppercase rounded-sm transition-all shadow-[0_0_15px_rgba(255,90,31,0.35)] hover:shadow-[0_0_25px_rgba(255,90,31,0.6)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>{loading ? 'TRANSMITTING...' : 'TRANSMIT'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: PASSENGER LOGS */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Header Tag */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-[2px] bg-[#38D9D9]" />
              <h2 className="font-orbitron font-black text-2xl sm:text-3xl uppercase tracking-[0.1em] text-white">
                PASSENGER LOGS
              </h2>
            </div>

            {/* Testimonials list cards */}
            <div className="space-y-4">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0B1020]/80 border border-[#20283A] hover:border-[#38D9D9]/50 p-5 rounded-sm transition-all duration-300 shadow-md group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="font-orbitron font-bold text-xs uppercase text-white tracking-wider group-hover:text-[#38D9D9] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-rajdhani text-[#38D9D9] uppercase tracking-widest">
                        {item.mission}
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_0_6px_rgba(255,184,0,0.5)]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#BAC2D6] font-space italic leading-relaxed">
                    "{item.quote}"
                  </p>

                  {/* Date footer */}
                  <div className="mt-3 pt-2 border-t border-[#20283A]/50 flex justify-between items-center text-[9px] font-rajdhani text-[#8B91A1] uppercase tracking-widest">
                    <span>VERIFIED FLIGHT MANIFEST</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
