import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Planet, TravelPackage, Passenger } from '../types';
import { useAuth } from '../context/AuthContext';
import { DateChoiceSelector } from '../components/DateChoiceSelector';
import { 
  Rocket, 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Check, 
  ChevronLeft,
  DollarSign
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { planetId } = useParams<{ planetId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [planet, setPlanet] = useState<Planet | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number>(2); // Default to Explorer
  const [travelersCount, setTravelersCount] = useState<number>(
    parseInt(searchParams.get('travelers') || '2', 10)
  );
  const [departureDate, setDepartureDate] = useState<string>(
    searchParams.get('date') || '2027-03-15'
  );

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    async function loadData() {
      if (!planetId) return;
      try {
        setLoading(true);
        const [planetData, packagesData] = await Promise.all([
          api.getPlanetById(planetId),
          api.getPackages(),
        ]);
        setPlanet(planetData);
        setPackages(packagesData);

        const urlPackageId = searchParams.get('package');
        if (urlPackageId && packagesData.some(p => p.id === Number(urlPackageId))) {
          setSelectedPackageId(Number(urlPackageId));
        } else if (packagesData.length > 0) {
          setSelectedPackageId(packagesData[1]?.id || packagesData[0].id);
        }
      } catch (err: unknown) {
        console.error('Failed to load booking parameters:', err);
        setErrorMsg('Failed to load expedition telemetry.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [planetId, searchParams]);

  // Adjust passenger manifest list whenever travelersCount or user changes
  useEffect(() => {
    setPassengers((prev) => {
      const updated: Passenger[] = [];
      for (let i = 0; i < travelersCount; i++) {
        if (prev[i]) {
          updated.push(prev[i]);
        } else {
          // Prefill Traveler 1 if user is logged in
          if (i === 0 && user) {
            updated.push({
              full_name: user.full_name || '',
              email: user.email || '',
              phone: user.phone || '+1 800-555-ORBIT',
              date_of_birth: '1992-06-15',
              passport_number: `SPC-${Math.floor(100000 + Math.random() * 900000)}`,
              emergency_contact: 'Flight Control Protocol (+1 800-555-0000)',
            });
          } else {
            updated.push({
              full_name: '',
              email: '',
              phone: '',
              date_of_birth: '1995-01-01',
              passport_number: `SPC-${Math.floor(100000 + Math.random() * 900000)}`,
              emergency_contact: 'Orbital Control (+1 800-555-9999)',
            });
          }
        }
      }
      return updated;
    });
  }, [travelersCount, user]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const basePrice = planet ? Number(planet.price) : 0;
  const packagePrice = selectedPackage ? Number(selectedPackage.price) : 0;
  const subtotal = (basePrice * travelersCount) + packagePrice;
  const orbitalTax = Math.round(subtotal * 0.05); // 5% Spaceport Tax
  const finalTotal = subtotal + orbitalTax;

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check auth
    if (!user) {
      navigate(`/login?redirect=/booking/${planetId}?travelers=${travelersCount}`);
      return;
    }

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.full_name.trim() || !p.email.trim()) {
        setErrorMsg(`Please complete full name and email for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!departureDate) {
      setErrorMsg('Please specify an orbital departure launch window date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.createBooking({
        userId: user.id,
        planetId: Number(planetId),
        packageId: selectedPackageId,
        travelers: travelersCount,
        departureDate,
        passengers,
      });

      // Redirect to fake payment checkout
      navigate(`/payment/${res.booking.id}`);
    } catch (err: unknown) {
      console.error('Booking submission error:', err);
      const msg = err instanceof Error ? err.message : 'Mission reservation failed.';
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-[#38D9D9] animate-spin" />
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h2 className="font-orbitron text-2xl text-white">Target World Not Found</h2>
        <Link to="/planets" className="mt-4 text-xs font-orbitron text-[#38D9D9] hover:underline">
          Return to Planet Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-orbitron text-[#8B91A1] hover:text-[#38D9D9] mb-8 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK TO PREVIOUS TELEMETRY</span>
        </button>

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[2px] w-8 bg-[#FF5A1F]" />
          <h1 className="font-orbitron font-black text-2xl sm:text-4xl uppercase tracking-[0.06em] text-white">
            MISSION CONFIGURATION: <span className="text-[#FF5A1F]">{planet.name}</span>
          </h1>
        </div>

        {/* Auth notice if guest */}
        {!user && (
          <div className="mb-8 p-4 bg-[#FF5A1F]/10 border border-[#FF5A1F]/40 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF5A1F] shrink-0" />
              <div>
                <div className="font-orbitron font-bold text-xs text-white uppercase">
                  UNAUTHENTICATED EXPLORER
                </div>
                <div className="text-xs text-[#BAC2D6] font-space">
                  Please log in or create your space-pilot credentials to finalize flight reservation.
                </div>
              </div>
            </div>
            <Link
              to={`/login?redirect=/booking/${planetId}?travelers=${travelersCount}`}
              className="px-4 py-2 bg-[#FF5A1F] text-white text-xs font-orbitron font-bold uppercase rounded-sm whitespace-nowrap shadow-[0_0_10px_rgba(255,90,31,0.4)]"
            >
              LOGIN / REGISTER
            </Link>
          </div>
        )}

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission Setup & Passenger Manifest */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Expedition Tier Selection */}
            <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-4 hud-corner">
              <div className="flex items-center justify-between border-b border-[#20283A] pb-3">
                <span className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
                  1. SELECT TRAVEL TIER PACKAGE
                </span>
                <span className="text-[10px] font-rajdhani text-[#38D9D9] uppercase tracking-widest">
                  FLIGHT ACCOMMODATIONS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#121A33] border-[#38D9D9] shadow-[0_0_15px_rgba(56,217,217,0.2)]'
                          : 'bg-[#05070D] border-[#20283A] hover:border-[#2E3B57]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-orbitron font-bold text-sm text-white uppercase">
                          {pkg.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#38D9D9]" />}
                      </div>
                      <div className="text-xs font-orbitron text-[#FF5A1F] font-bold mb-2">
                        +₹{pkg.price.toLocaleString('en-IN')}
                      </div>
                      <p className="text-[11px] text-[#8B91A1] font-space line-clamp-3">
                        {pkg.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Flight Parameters (Travelers & Date Web Choice) */}
            <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#20283A] pb-3">
                <span className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
                  2. FLIGHT PARAMETERS & LAUNCH WINDOW
                </span>
                <span className="text-[10px] font-rajdhani text-[#38D9D9] uppercase tracking-widest">
                  ORBITAL TRAJECTORY SELECTION
                </span>
              </div>

              {/* Number of Astronaut Travelers */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-orbitron uppercase text-[#8B91A1]">
                  Number of Astronaut Travelers
                </label>
                <div className="flex items-center bg-[#05070D] border border-[#20283A] rounded-sm px-3 py-1.5 w-full sm:w-48">
                  <button
                    type="button"
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-8 h-8 flex items-center justify-center text-lg text-[#8B91A1] hover:text-white font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-orbitron font-bold text-sm text-white">
                    {travelersCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelersCount(Math.min(8, travelersCount + 1))}
                    className="w-8 h-8 flex items-center justify-center text-lg text-[#8B91A1] hover:text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Orbital Launch Window Date Web Choice Component */}
              <div className="pt-4 border-t border-[#20283A]/70">
                <DateChoiceSelector
                  selectedDate={departureDate}
                  onDateChange={(newDate) => setDepartureDate(newDate)}
                  variant="card"
                  label="Orbital Launch Window Date Selection"
                  showTelemetry={true}
                />
              </div>
            </div>

            {/* Step 3: Dynamic Passenger Manifests */}
            <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#20283A] pb-3">
                <span className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
                  3. PASSENGER MANIFEST ({travelersCount} TRAVELER{travelersCount > 1 ? 'S' : ''})
                </span>
                <span className="text-[10px] font-rajdhani text-[#FF5A1F] uppercase tracking-widest">
                  BIOMETRICS & EMERGENCY CONTACTS
                </span>
              </div>

              <div className="space-y-6">
                {passengers.map((passenger, idx) => (
                  <div
                    key={idx}
                    className="bg-[#05070D] border border-[#20283A] p-4 rounded-sm space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-[#38D9D9] uppercase tracking-wider">
                      <div className="w-5 h-5 rounded-full bg-[#121A33] border border-[#38D9D9]/40 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </div>
                      <span>TRAVELER {idx + 1} SPECIFICATIONS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-orbitron text-[#8B91A1] uppercase">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Commander Sarah Jenkins"
                          value={passenger.full_name}
                          onChange={(e) => handlePassengerChange(idx, 'full_name', e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs text-white rounded-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-orbitron text-[#8B91A1] uppercase">
                          Sub-Space Frequency Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. sarah.jenkins@orbit.space"
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs text-white rounded-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-orbitron text-[#8B91A1] uppercase">
                          ComLink Phone
                        </label>
                        <input
                          type="text"
                          placeholder="+1 800-555-ORBIT"
                          value={passenger.phone}
                          onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs text-white rounded-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-orbitron text-[#8B91A1] uppercase">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={passenger.date_of_birth}
                          onChange={(e) => handlePassengerChange(idx, 'date_of_birth', e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs text-white rounded-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-orbitron text-[#8B91A1] uppercase">
                          Emergency Contact (Ground Liaison & Frequency)
                        </label>
                        <input
                          type="text"
                          placeholder="Elena Vance (+1 800-555-9999 / Houston Mission Control)"
                          value={passenger.emergency_contact}
                          onChange={(e) => handlePassengerChange(idx, 'emergency_contact', e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs text-white rounded-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Mission Summary & Dynamic Price Ledger */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="bg-[#0B1020] border border-[#20283A] p-6 rounded-sm space-y-5 hud-corner shadow-2xl">
              
              {/* Planet Mini Card */}
              <div className="flex items-center gap-3 border-b border-[#20283A] pb-4">
                <img
                  src={planet.image_url}
                  alt={planet.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-[#38D9D9]/40 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-orbitron text-[#38D9D9] uppercase tracking-widest">
                    DESTINATION
                  </div>
                  <div className="font-orbitron font-black text-xl text-white uppercase">
                    {planet.name}
                  </div>
                  <div className="text-[10px] font-rajdhani text-[#8B91A1] uppercase">
                    {planet.distance_from_earth} • {planet.travel_time}
                  </div>
                </div>
              </div>

              {/* Mission Launch Parameter Badge */}
              <div className="p-3 bg-[#05070D] border border-[#20283A] rounded-sm space-y-1">
                <div className="text-[10px] font-orbitron uppercase text-[#8B91A1] flex items-center justify-between">
                  <span>LAUNCH WINDOW</span>
                  <span className="text-[#38D9D9] font-bold">{travelersCount} Astronaut{travelersCount > 1 ? 's' : ''}</span>
                </div>
                <div className="font-orbitron font-bold text-xs text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>{departureDate}</span>
                </div>
              </div>

              {/* Price Calculation Breakdown (Validated by Backend) */}
              <div className="space-y-3 text-xs font-space text-[#BAC2D6]">
                <div className="flex justify-between items-center">
                  <span>Base Fare (₹{basePrice.toLocaleString('en-IN')} × {travelersCount}):</span>
                  <span className="font-orbitron text-white">₹{(basePrice * travelersCount).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Selected Tier ({selectedPackage?.name}):</span>
                  <span className="font-orbitron text-white">₹{packagePrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Orbital Gateway Launch Tax (5%):</span>
                  <span className="font-orbitron text-[#8B91A1]">₹{orbitalTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-[#20283A] flex justify-between items-baseline">
                  <span className="font-orbitron font-bold text-sm text-white uppercase">TOTAL FARE:</span>
                  <span className="font-orbitron font-black text-2xl text-[#FF5A1F] drop-shadow-[0_0_10px_rgba(255,90,31,0.5)]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-sm text-xs font-space text-[#FF5A1F] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Proceed to Payment Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white font-orbitron font-bold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_30px_rgba(255,90,31,0.7)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ENCODING RESERVATION...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO PAYMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] font-rajdhani text-[#8B91A1] uppercase tracking-widest">
                DEMO CARD CHECKOUT • NO REAL MONETARY CHARGES
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
