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
  Eye, 
  XCircle, 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertCircle,
  FileText,
  ChevronLeft
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/my-bookings');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.getUserBookings(user.id);
      setBookings(data);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!user) return;
    const confirm = window.confirm('Are you sure you wish to cancel this interplanetary reservation?');
    if (!confirm) return;

    try {
      setCancellingId(bookingId);
      await api.cancelBooking(bookingId, user.id);
      await loadBookings();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.booking_status === filter;
  });

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20283A] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-orbitron text-[#FF5A1F] uppercase tracking-widest mb-1">
              <Calendar className="w-4 h-4" />
              <span>ORBITAL FLIGHT ARCHIVE</span>
            </div>
            <h1 className="font-orbitron font-black text-2xl sm:text-4xl uppercase text-white">
              MY <span className="text-[#38D9D9]">EXPEDITIONS</span>
            </h1>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-orbitron font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-[#38D9D9] text-[#05070D]'
                    : 'bg-[#0B1020] text-[#8B91A1] border border-[#20283A] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List Table / Cards */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#38D9D9] animate-spin mx-auto" />
            <div className="text-xs font-orbitron text-[#8B91A1] mt-3 uppercase tracking-widest">
              QUERYING SQL EXPEDITION LEDGER...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-12 text-center space-y-4">
            <Rocket className="w-10 h-10 text-[#8B91A1] mx-auto opacity-50" />
            <h3 className="font-orbitron font-bold text-lg text-white uppercase">
              No Missions Found
            </h3>
            <p className="text-xs text-[#8B91A1] font-space max-w-sm mx-auto">
              You currently have no registered missions matching the selected status filter.
            </p>
            <Link
              to="/planets"
              className="inline-block px-6 py-2.5 bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-sm"
            >
              BOOK AN EXPEDITION
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => {
              const isConfirmed = b.booking_status === 'CONFIRMED';
              const isPending = b.booking_status === 'PENDING';
              const isCancelled = b.booking_status === 'CANCELLED';

              return (
                <div
                  key={b.id}
                  className="bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9]/50 rounded-sm p-5 sm:p-6 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={b.planet_image || 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=300&q=80'}
                      alt={b.planet_name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border border-[#38D9D9]/40 shrink-0 hidden sm:block"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#8B91A1]">{b.booking_reference}</span>
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[9px] font-orbitron font-bold uppercase tracking-wider ${
                            isConfirmed
                              ? 'bg-[#38D9D9]/20 text-[#38D9D9] border border-[#38D9D9]/40'
                              : isPending
                              ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40'
                              : 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40'
                          }`}
                        >
                          {b.booking_status}
                        </span>
                      </div>

                      <h3 className="font-orbitron font-bold text-xl text-white uppercase">
                        {b.planet_name} EXPEDITION
                      </h3>

                      <div className="flex flex-wrap gap-4 text-xs font-space text-[#BAC2D6] pt-1">
                        <span>Tier: <strong className="text-white">{b.package_name}</strong></span>
                        <span>Travelers: <strong className="text-white">{b.travelers}</strong></span>
                        <span>Launch: <strong className="text-white">{b.departure_date}</strong></span>
                        <span>Amount: <strong className="text-[#38D9D9]">₹{b.total_amount.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {isConfirmed && (
                      <Link
                        to={`/booking-success/${b.id}`}
                        className="px-4 py-2 bg-[#121A33] border border-[#38D9D9]/50 hover:border-[#38D9D9] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#38D9D9]" />
                        <span>BOARDING PASS</span>
                      </Link>
                    )}

                    {isPending && (
                      <Link
                        to={`/payment/${b.id}`}
                        className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all shadow-[0_0_12px_rgba(255,90,31,0.4)] flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>PAY NOW</span>
                      </Link>
                    )}

                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-4 py-2 bg-[#05070D] border border-[#20283A] hover:border-white text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      DETAILS
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancellingId === b.id}
                        className="px-3 py-2 text-xs font-orbitron text-[#8B91A1] hover:text-[#FF5A1F] transition-colors cursor-pointer"
                        title="Cancel Booking"
                      >
                        {cancellingId === b.id ? 'CANCELLING...' : 'CANCEL'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Full Booking Details Manifest */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-[#05070D]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0B1020] border border-[#38D9D9]/50 rounded-sm max-w-2xl w-full p-6 space-y-6 shadow-2xl hud-corner max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-[#20283A] pb-4">
                <div>
                  <span className="text-[10px] font-orbitron text-[#38D9D9] uppercase tracking-widest">
                    FLIGHT TELEMETRY RECORD
                  </span>
                  <h3 className="font-orbitron font-black text-xl text-white uppercase">
                    {selectedBooking.planet_name} EXPEDITION
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-[#8B91A1] hover:text-white cursor-pointer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-space text-[#BAC2D6]">
                <div>
                  <span className="text-[#8B91A1]">Reference ID:</span>
                  <div className="font-mono text-white font-bold">{selectedBooking.booking_reference}</div>
                </div>
                <div>
                  <span className="text-[#8B91A1]">Status:</span>
                  <div className="font-orbitron text-[#38D9D9] font-bold">{selectedBooking.booking_status}</div>
                </div>
                <div>
                  <span className="text-[#8B91A1]">Launch Date:</span>
                  <div className="font-orbitron text-white">{selectedBooking.departure_date}</div>
                </div>
                <div>
                  <span className="text-[#8B91A1]">Tier Package:</span>
                  <div className="font-orbitron text-white">{selectedBooking.package_name}</div>
                </div>
                <div>
                  <span className="text-[#8B91A1]">Total Fare:</span>
                  <div className="font-orbitron text-[#FF5A1F] font-bold text-sm">
                    ₹{selectedBooking.total_amount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-[#8B91A1]">Payment Method:</span>
                  <div className="font-orbitron text-white">
                    {selectedBooking.payment ? `SPACE CARD (**** ${selectedBooking.payment.card_last_four})` : 'UNPAID'}
                  </div>
                </div>
              </div>

              {/* Passengers list */}
              {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
                <div className="border-t border-[#20283A] pt-4 space-y-3">
                  <div className="text-[11px] font-orbitron text-[#8B91A1] uppercase tracking-wider">
                    REGISTERED PASSENGER MANIFESTS ({selectedBooking.passengers.length})
                  </div>
                  <div className="space-y-2">
                    {selectedBooking.passengers.map((p, idx) => (
                      <div key={idx} className="bg-[#05070D] p-3 rounded-xs border border-[#20283A] text-xs font-space">
                        <div className="font-bold text-white flex justify-between">
                          <span>{idx + 1}. {p.full_name}</span>
                          <span className="text-[10px] text-[#38D9D9]">{p.passport_number}</span>
                        </div>
                        <div className="text-[11px] text-[#8B91A1] mt-1">
                          Email: {p.email} • Phone: {p.phone || 'N/A'} • Emergency: {p.emergency_contact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3 border-t border-[#20283A]">
                {selectedBooking.booking_status === 'CONFIRMED' && (
                  <Link
                    to={`/booking-success/${selectedBooking.id}`}
                    className="px-4 py-2 bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase rounded-sm"
                  >
                    VIEW BOARDING PASS
                  </Link>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-[#05070D] border border-[#20283A] text-white text-xs font-orbitron rounded-sm"
                >
                  CLOSE
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
