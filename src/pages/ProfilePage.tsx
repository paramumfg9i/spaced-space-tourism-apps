import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Message } from '../types';
import { User, Mail, Phone, ShieldCheck, Radio, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
      return;
    }
    setFullName(user.full_name || '');
    setPhone(user.phone || '');

    async function loadUserMessages() {
      if (!user) return;
      try {
        setLoadingMsg(true);
        const list = await api.getUserMessages(user.id);
        setMessages(list);
      } catch (err) {
        console.error('Failed to load user transmission logs:', err);
      } finally {
        setLoadingMsg(false);
      }
    }
    loadUserMessages();
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusText(null);

    try {
      const res = await api.updateProfile({
        userId: user.id,
        full_name: fullName,
        phone,
      });
      updateUser(res.user);
      setStatusText('Profile successfully updated in orbital flight registry.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      setStatusText(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Title */}
        <div className="border-b border-[#20283A] pb-6">
          <div className="text-xs font-orbitron text-[#38D9D9] uppercase tracking-widest mb-1">
            PILOT PROFILE TELEMETRY
          </div>
          <h1 className="font-orbitron font-black text-2xl sm:text-4xl text-white uppercase">
            COMMANDER <span className="text-[#FF5A1F]">{user.full_name}</span>
          </h1>
        </div>

        {/* Profile Details Form */}
        <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-6 sm:p-8 hud-corner shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#20283A] pb-3">
            <User className="w-5 h-5 text-[#38D9D9]" />
            <h2 className="font-orbitron font-bold text-lg text-white uppercase">
              FLIGHT MANIFEST DATA
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                  Commander Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                  Sub-Space Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-[#05070D]/50 border border-[#20283A] px-3 py-2 text-xs font-space text-[#8B91A1] rounded-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                  ComLink Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#05070D] border border-[#20283A] focus:border-[#38D9D9] px-3 py-2 text-xs font-space text-white rounded-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron uppercase text-[#8B91A1]">
                  Clearance Level
                </label>
                <div className="w-full bg-[#05070D] border border-[#20283A] px-3 py-2 text-xs font-orbitron text-[#38D9D9] rounded-sm">
                  TIER-IV INTERPLANETARY PILOT
                </div>
              </div>
            </div>

            {statusText && (
              <div className="p-3 bg-[#38D9D9]/10 border border-[#38D9D9]/30 rounded-sm text-xs font-space text-[#38D9D9] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{statusText}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#ff6e36] text-white text-xs font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
            >
              {saving ? 'UPDATING...' : 'SAVE CHANGES'}
            </button>
          </form>
        </div>

        {/* Sub-Space Transmissions Log */}
        <div className="bg-[#0B1020] border border-[#20283A] rounded-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#20283A] pb-3">
            <Radio className="w-5 h-5 text-[#FF5A1F]" />
            <h2 className="font-orbitron font-bold text-lg text-white uppercase">
              TRANSMISSION BROADCAST HISTORY
            </h2>
          </div>

          {loadingMsg ? (
            <div className="py-4 text-center">
              <Loader2 className="w-6 h-6 text-[#38D9D9] animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-xs font-space text-[#8B91A1] py-4">
              No direct message broadcasts logged under your frequency.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="bg-[#05070D] p-4 rounded-xs border border-[#20283A] space-y-1">
                  <div className="flex justify-between text-[11px] font-orbitron text-[#38D9D9]">
                    <span>{m.subject || 'Interplanetary Inquiry'}</span>
                    <span className="text-[#8B91A1] text-[9px]">{m.created_at}</span>
                  </div>
                  <p className="text-xs font-space text-[#BAC2D6]">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
