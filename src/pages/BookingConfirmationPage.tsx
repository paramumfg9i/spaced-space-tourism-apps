import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Rocket, 
  Download, 
  Printer, 
  ArrowRight, 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Loader2,
  QrCode
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfirmation() {
      if (!bookingId) return;
      try {
        setLoading(true);
        const data = await api.getBookingById(bookingId);
        setBooking(data);
      } catch (err: unknown) {
        console.error('Failed to load confirmed booking:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfirmation();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-[#38D9D9] animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h2 className="font-orbitron text-2xl text-white">Mission Record Not Found</h2>
        <Link to="/" className="mt-4 text-xs font-orbitron text-[#38D9D9]">
          Return to Home Base
        </Link>
      </div>
    );
  }

  const primaryPassenger = booking.passengers?.[0]?.full_name || user?.full_name || 'Valued Space Explorer';

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#38D9D9]/20 border border-[#38D9D9] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(56,217,217,0.4)]">
            <CheckCircle className="w-8 h-8 text-[#38D9D9]" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#0B1020] border border-[#38D9D9]/30 text-[#38D9D9] text-[10px] font-orbitron font-bold uppercase tracking-widest">
            ORBITAL RESERVATION CONFIRMED & PAID
          </div>

          <h1 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-[0.06em] text-white">
            MISSION <span className="text-[#FF5A1F]">CONFIRMED</span>
          </h1>

          <p className="text-sm sm:text-base text-[#BAC2D6] font-space max-w-lg mx-auto">
            Congratulations, <strong className="text-white">{primaryPassenger}</strong>! Your expedition to <strong className="text-[#38D9D9]">{booking.planet_name?.toUpperCase()}</strong> has been successfully booked and committed to the flight manifest.
          </p>
        </div>

        {/* Futuristic Space Boarding Pass / Ticket Component */}
        <div className="bg-[#0B1020] border border-[#20283A] rounded-sm overflow-hidden shadow-2xl hud-corner mb-8 print:border-black print:bg-white print:text-black">
          
          {/* Boarding Pass Header */}
          <div className="bg-[#05070D] border-b border-[#20283A] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#121A33] border border-[#38D9D9]/40 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[#38D9D9]" />
              </div>
              <div>
                <span className="font-orbitron font-black text-xl tracking-widest text-white">
                  SPACED INTERPLANETARY
                </span>
                <div className="text-[10px] font-rajdhani text-[#8B91A1] uppercase tracking-widest">
                  OFFICIAL FLIGHT BOARDING PASS • TICKET MANIFEST
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[9px] font-orbitron text-[#8B91A1] uppercase">BOOKING REFERENCE</div>
              <div className="font-orbitron font-black text-base text-[#FF5A1F] tracking-wider">
                {booking.booking_reference}
              </div>
            </div>
          </div>

          {/* Ticket Details Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Main Telemetry */}
            <div className="md:col-span-8 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">TARGET WORLD</div>
                  <div className="font-orbitron font-bold text-lg text-white uppercase mt-0.5">
                    {booking.planet_name}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">EXPEDITION TIER</div>
                  <div className="font-orbitron font-bold text-lg text-[#38D9D9] uppercase mt-0.5">
                    {booking.package_name}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">TOTAL TRAVELERS</div>
                  <div className="font-orbitron font-bold text-lg text-white uppercase mt-0.5">
                    {booking.travelers} PASSENGERS
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">DEPARTURE WINDOW</div>
                  <div className="font-orbitron font-bold text-sm text-white mt-0.5">
                    {booking.departure_date}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">GATEWAY PORT</div>
                  <div className="font-orbitron font-bold text-sm text-white mt-0.5">
                    GATEWAY LEO-04
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase">STATUS</div>
                  <div className="inline-block px-2 py-0.5 rounded-xs bg-[#38D9D9]/20 text-[#38D9D9] font-orbitron font-bold text-xs uppercase mt-0.5">
                    {booking.booking_status}
                  </div>
                </div>
              </div>

              {/* Passenger manifest list */}
              {booking.passengers && booking.passengers.length > 0 && (
                <div className="pt-4 border-t border-[#20283A]">
                  <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase tracking-wider mb-2">
                    CONFIRMED PASSENGER MANIFEST
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {booking.passengers.map((p, i) => (
                      <div key={i} className="text-xs font-space text-[#BAC2D6] bg-[#05070D] p-2 rounded-xs border border-[#20283A] flex justify-between">
                        <span className="font-semibold text-white">{i + 1}. {p.full_name}</span>
                        <span className="text-[10px] text-[#8B91A1]">{p.passport_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="pt-4 border-t border-[#20283A] flex flex-wrap items-center justify-between text-xs font-space text-[#8B91A1] gap-2">
                <div>
                  <span>TRANSACTION ID: </span>
                  <span className="font-mono text-white font-bold">{booking.payment?.transaction_id || 'SPC-2026-CONFIRMED'}</span>
                </div>
                <div>
                  <span>AMOUNT PAID: </span>
                  <span className="font-orbitron font-bold text-white text-sm">₹{booking.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Right: Flight QR / Barcode Verification Stamp */}
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#20283A] md:pl-8 flex flex-col items-center justify-center text-center space-y-4">
              
              <div className="p-3 bg-white rounded-sm text-black">
                <div className="w-28 h-28 flex flex-col items-center justify-center border-2 border-black p-1">
                  <div className="grid grid-cols-5 gap-1 w-full h-full">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (i % 2 === 0 || i % 3 === 0) ? 'bg-black' : 'bg-transparent'
                        } rounded-xs`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-orbitron font-bold uppercase tracking-widest text-[#38D9D9]">
                  FLIGHT SECURITY CODE
                </div>
                <div className="text-[8px] font-mono text-[#8B91A1]">
                  SHA256: 8f9b4c0e...7a1
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/my-bookings"
            className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(255,90,31,0.4)] flex items-center gap-2"
          >
            <span>VIEW MY BOOKINGS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-[#0B1020] border border-[#20283A] hover:border-[#38D9D9] text-[#F5F5F5] text-xs font-orbitron font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#38D9D9]" />
            <span>PRINT RECEIPT</span>
          </button>

          <Link
            to="/"
            className="px-6 py-3 bg-[#05070D] border border-[#20283A] hover:border-white text-[#8B91A1] hover:text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            RETURN HOME
          </Link>
        </div>

      </div>
    </div>
  );
};
