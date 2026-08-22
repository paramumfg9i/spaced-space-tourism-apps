import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking } from '../types';
import { 
  Rocket, 
  Calendar, 
  Users, 
  CreditCard, 
  Compass, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Activity, 
  Globe, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/dashboard');
      return;
    }

    async function loadUserBookings() {
      try {
        const list = await api.getUserBookings(user!.id);
        setBookings(list);
      } catch (err) {
        console.error('Failed to load user dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserBookings();
  }, [user, navigate]);

  if (!user) return null;

  const nextMission = bookings.find((b) => b.booking_status === 'CONFIRMED') || bookings[0];

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20283A] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-orbitron text-[#38D9D9] uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-[#38D9D9] animate-ping" />
              <span>COMMANDER FLIGHT DECK</span>
            </div>
            <h1 className="font-orbitron font-black text-2xl sm:text-4xl text-white uppercase">
              WELCOME BACK, <span className="text-[#FF5A1F]">{user.full_name?.toUpperCase()}</span>
            </h1>
            <p className="text-xs text-[#8B91A1] font-space mt-1">
              ComLink ID: {user.email} • Flight Authorization: Level 4 Interstellar Clear
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/planets"
              className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all shadow-[0_0_15px_rgba(255,90,31,0.35)]"
            >
              EXPLORE WORLDS
            </Link>
            <Link
              to="/my-bookings"
              className="px-5 py-2.5 bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              MY EXPEDITIONS
            </Link>
          </div>
        </div>

        {/* Highlight Banner: Next Upcoming Mission */}
        {nextMission ? (
          <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-6 sm:p-8 hud-corner shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xs bg-[#38D9D9]/20 text-[#38D9D9] text-[10px] font-orbitron font-bold uppercase tracking-widest border border-[#38D9D9]/40">
                    NEXT UPCOMING EXPEDITION
                  </span>
                  <span className="text-xs font-mono text-[#8B91A1]">
                    {nextMission.booking_reference}
                  </span>
                </div>

                <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white uppercase">
                  {nextMission.planet_name} EXPEDITION
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">DEPARTURE DATE</div>
                    <div className="font-orbitron font-bold text-sm text-white mt-0.5">
                      {nextMission.departure_date}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">TRAVELERS</div>
                    <div className="font-orbitron font-bold text-sm text-white mt-0.5">
                      {nextMission.travelers} Astronaut(s)
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">AMOUNT PAID</div>
                    <div className="font-orbitron font-bold text-sm text-[#38D9D9] mt-0.5">
                      ₹{nextMission.total_amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">STATUS</div>
                    <div className="font-orbitron font-bold text-sm text-[#FF5A1F] mt-0.5">
                      {nextMission.booking_status}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <Link
                    to={`/booking-success/${nextMission.id}`}
                    className="px-5 py-2.5 bg-[#121A33] border border-[#38D9D9]/50 hover:border-[#38D9D9] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                  >
                    <span>VIEW LAUNCH PASS</span>
                    <ArrowRight className="w-4 h-4 text-[#38D9D9]" />
                  </Link>
                </div>
              </div>

              {/* Mission Visual Hologram */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-[0_0_40px_rgba(56,217,217,0.25)] border-2 border-[#20283A]">
                  <img
                    src={nextMission.planet_image || 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80'}
                    alt={nextMission.planet_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter contrast-125"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_35px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-8 text-center space-y-4">
            <Rocket className="w-10 h-10 text-[#38D9D9] mx-auto animate-pulse" />
            <h3 className="font-orbitron font-bold text-xl text-white uppercase">
              No Active Flight Reservations
            </h3>
            <p className="text-xs text-[#8B91A1] font-space max-w-md mx-auto">
              Your flight deck is clear. Discover new worlds across the Solar System and schedule your first interplanetary mission.
            </p>
            <Link
              to="/planets"
              className="inline-block px-6 py-3 bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-sm"
            >
              EXPLORE PLANET ARCHIVE
            </Link>
          </div>
        )}

        {/* Recent Expeditions Quick Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron font-bold text-xl uppercase tracking-wider text-white">
              MY EXPEDITION ARCHIVE
            </h2>
            <Link to="/my-bookings" className="text-xs font-orbitron text-[#38D9D9] hover:underline">
              VIEW FULL MANIFEST ({bookings.length})
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 text-[#38D9D9] animate-spin mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-[#0B1020] border border-[#20283A] p-6 text-center text-xs text-[#8B91A1] font-space">
              No previous bookings recorded in MySQL ledger.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9]/50 p-5 rounded-sm flex items-center justify-between transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#8B91A1]">{b.booking_reference}</div>
                    <div className="font-orbitron font-bold text-base text-white uppercase">
                      {b.planet_name} EXPEDITION
                    </div>
                    <div className="text-xs text-[#BAC2D6] font-space">
                      {b.departure_date} • {b.travelers} Travelers • ₹{b.total_amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <Link
                    to={b.booking_status === 'CONFIRMED' ? `/booking-success/${b.id}` : `/payment/${b.id}`}
                    className="px-3 py-1.5 bg-[#05070D] border border-[#20283A] hover:border-[#38D9D9] text-[11px] font-orbitron text-white rounded-xs uppercase tracking-wider"
                  >
                    {b.booking_status === 'CONFIRMED' ? 'PASS' : 'PAY'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
