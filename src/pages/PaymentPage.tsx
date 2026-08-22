import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  CheckCircle,
  Activity,
  Cpu
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState<boolean>(true);
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState<string>('4111 1111 1111 1111');
  const [expiry, setExpiry] = useState<string>('12/30');
  const [cvv, setCvv] = useState<string>('123');
  const [cardHolder, setCardHolder] = useState<string>(user?.full_name || 'COMMANDER ALEX MERCER');

  // Processing State
  const [processing, setProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return;
      try {
        setLoadingBooking(true);
        const data = await api.getBookingById(bookingId);
        setBooking(data);
        if (data.booking_status === 'CONFIRMED' && data.payment) {
          navigate(`/booking-success/${bookingId}`);
        }
      } catch (err: unknown) {
        console.error('Failed to load booking for payment:', err);
        setErrorMsg('Could not find corresponding mission booking.');
      } finally {
        setLoadingBooking(false);
      }
    }
    loadBooking();
  }, [bookingId, navigate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const fillDemoCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setExpiry('12/30');
    setCvv('123');
    setCardHolder(user?.full_name?.toUpperCase() || 'COMMANDER ALEX MERCER');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    const rawCard = cardNumber.replace(/\s+/g, '');
    if (rawCard.length < 15) {
      setErrorMsg('Please enter a valid 16-digit card number.');
      return;
    }

    if (!expiry || expiry.length < 5) {
      setErrorMsg('Please enter a valid MM/YY expiration date.');
      return;
    }

    if (!cvv || cvv.length < 3) {
      setErrorMsg('Please enter a valid 3-digit CVV.');
      return;
    }

    setProcessing(true);
    setErrorMsg(null);

    // Multi-stage realistic space payment HUD simulation
    try {
      setProcessingStage('ESTABLISHING SECURE LEO QUANTUM TUNNEL...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage('VERIFYING INTERPLANETARY CLEARANCE...');
      await new Promise((r) => setTimeout(r, 800));

      setProcessingStage('COMMITTING ENCRYPTED TRANSACTION TO SQL LEDGER...');

      const res = await api.processPayment({
        bookingId: Number(bookingId),
        cardNumber: rawCard,
        expiry,
        cvv,
        cardHolder,
        amount: booking.total_amount,
      });

      // Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5A1F', '#38D9D9', '#FFFFFF'],
        });
      } catch (e) {
        // ignore
      }

      await new Promise((r) => setTimeout(r, 500));
      navigate(`/booking-success/${bookingId}`);
    } catch (err: unknown) {
      console.error('Payment failure:', err);
      const msg = err instanceof Error ? err.message : 'Demo payment gateway failed.';
      setErrorMsg(msg);
      setProcessing(false);
    }
  };

  if (loadingBooking) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-[#38D9D9] animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h2 className="font-orbitron text-2xl text-white">Booking Not Found</h2>
        <Link to="/planets" className="mt-4 text-xs font-orbitron text-[#38D9D9]">
          Return to Planet Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Tag */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1020] border border-[#FF5A1F]/40 text-[#FF5A1F] text-[10px] font-orbitron font-bold uppercase tracking-widest mb-3">
            <Lock className="w-3 h-3" />
            <span>DEMO / SIMULATED CHECKOUT PROTOCOL</span>
          </div>
          <h1 className="font-orbitron font-black text-2xl sm:text-4xl uppercase tracking-[0.06em] text-white">
            SECURE <span className="text-[#38D9D9]">MISSION PAYMENT</span>
          </h1>
          <p className="text-xs text-[#8B91A1] font-space mt-1">
            This is a demonstration payment environment for testing space reservation flows.
          </p>
        </div>

        {/* Payment Main Container */}
        <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-6 sm:p-10 shadow-2xl hud-corner">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Mission Summary & Amount */}
            <div className="md:col-span-5 bg-[#05070D] border border-[#20283A] p-5 rounded-sm space-y-4">
              <div className="text-[10px] font-orbitron text-[#8B91A1] uppercase tracking-widest border-b border-[#20283A] pb-2">
                MISSION RESERVATION SUMMARY
              </div>

              <div className="space-y-2 text-xs font-space text-[#BAC2D6]">
                <div className="flex justify-between">
                  <span className="text-[#8B91A1]">Booking Ref:</span>
                  <span className="font-orbitron text-white">{booking.booking_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B91A1]">Destination:</span>
                  <span className="font-orbitron text-[#38D9D9]">{booking.planet_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B91A1]">Tier Package:</span>
                  <span className="font-orbitron text-white">{booking.package_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B91A1]">Travelers:</span>
                  <span className="font-orbitron text-white">{booking.travelers} Astronauts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B91A1]">Departure Window:</span>
                  <span className="font-orbitron text-white">{booking.departure_date}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#20283A] flex justify-between items-baseline">
                <span className="font-orbitron font-bold text-xs text-white uppercase">TOTAL FARE:</span>
                <span className="font-orbitron font-black text-xl text-[#FF5A1F]">
                  ₹{booking.total_amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Demo Helper Box */}
              <div className="bg-[#121A33]/70 border border-[#38D9D9]/30 p-3 rounded-xs space-y-2">
                <div className="text-[10px] font-orbitron text-[#38D9D9] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>TEST PILOT CREDENTIALS</span>
                  <button
                    type="button"
                    onClick={fillDemoCard}
                    className="text-[9px] underline hover:text-white cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="text-[10px] font-mono text-[#BAC2D6] space-y-0.5">
                  <div>Card: 4111 1111 1111 1111</div>
                  <div>Exp: 12/30 • CVV: 123</div>
                </div>
              </div>
            </div>

            {/* Right: Card Payment Form */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Virtual Holographic Space Card Visual */}
              <div className="bg-gradient-to-tr from-[#080E21] via-[#101935] to-[#1E294B] border border-[#38D9D9]/40 rounded-sm p-5 text-white shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-xs font-orbitron font-black tracking-widest text-[#38D9D9]">
                    SPACED FLIGHT PASS
                  </div>
                  <Cpu className="w-6 h-6 text-[#FF5A1F]" />
                </div>

                <div className="font-mono text-base sm:text-lg tracking-[0.2em] mb-4 text-[#F5F5F5]">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end text-[10px] font-orbitron uppercase">
                  <div>
                    <div className="text-[#8B91A1] text-[8px]">CARDHOLDER</div>
                    <div className="tracking-wider">{cardHolder || 'COMMANDER NAME'}</div>
                  </div>
                  <div>
                    <div className="text-[#8B91A1] text-[8px]">EXPIRES</div>
                    <div className="tracking-wider">{expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                    Card Number (Demo)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4111 1111 1111 1111"
                      className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-mono text-white rounded-sm outline-none"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A1]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="12/30"
                      className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-mono text-white rounded-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                      Security CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-mono text-white rounded-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="COMMANDER ALEX MERCER"
                    className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-orbitron text-white rounded-sm outline-none"
                  />
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="p-3 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-sm text-xs font-space text-[#FF5A1F] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Processing HUD or Submit Button */}
                {processing ? (
                  <div className="p-4 bg-[#05070D] border border-[#38D9D9]/50 rounded-sm text-center space-y-3">
                    <Loader2 className="w-6 h-6 text-[#38D9D9] animate-spin mx-auto" />
                    <div className="text-xs font-orbitron text-white font-bold tracking-widest uppercase animate-pulse">
                      {processingStage}
                    </div>
                    <div className="text-[10px] font-rajdhani text-[#8B91A1]">
                      PLEASE DO NOT CLOSE OR REFRESH SUB-SPACE TELEMETRY LINK
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_30px_rgba(255,90,31,0.7)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>PAY ₹{booking.total_amount.toLocaleString('en-IN')} (DEMO)</span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] font-rajdhani text-[#8B91A1] uppercase tracking-widest pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38D9D9]" />
                  <span>256-BIT QUANTUM SHA-3 ENCRYPTED GATEWAY</span>
                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
