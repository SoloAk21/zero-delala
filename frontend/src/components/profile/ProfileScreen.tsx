import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertiesQuery } from '../../hooks/useProperties';
import { ReferralCard } from './ReferralCard';
import { PromotionModal } from './PromotionModal';
import { Property } from '../../services/propertyService';
import { apiClient } from '../../services/api';
import {
  User,
  ShieldCheck,
  Phone,
  Building2,
  Loader2,
  CheckCircle,
  Eye,
  LogOut,
  Zap,
  AlertCircle
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification } = useTelegram();
  const { isAuthenticated, setAuth, logout, user } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isAgent, setIsAgent] = useState(user?.role === 'AGENT' || user?.isVerifiedAgent || false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [selectedPropertyForPromotion, setSelectedPropertyForPromotion] = useState<Property | null>(
    null
  );

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
    if (user?.isVerifiedAgent || user?.role === 'AGENT') {
      setIsAgent(true);
    }
  }, [user]);

  const { data: propertiesData } = usePropertiesQuery();
  const myProperties = (propertiesData?.properties || []).filter((p) => p.owner?.id === user?.id);

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticImpact('heavy');
    setVerifyingPhone(true);

    try {
      const response = await apiClient.post('/auth/verify-phone', {
        phoneNumber,
        isAgent
      });

      if (response.data?.data) {
        const token = useAuthStore.getState().token!;
        setAuth(token, response.data.data);
        setPhoneSuccess(true);
        hapticNotification('success');
        setTimeout(() => setPhoneSuccess(false), 4000);
      }
    } catch (err) {
      hapticNotification('error');
    } finally {
      setVerifyingPhone(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base uppercase">
            {user?.firstName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">
                {user?.firstName || 'Solo'} {user?.lastName || 'Ak'}
              </h2>
              {(user?.isVerifiedAgent || user?.phoneNumber) && (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              @{user?.username || 'SoloAk21'} •{' '}
              <span className="text-emerald-400 font-semibold">{user?.role || 'OWNER'}</span>
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => {
              hapticImpact('heavy');
              logout();
            }}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Phone Number & Verification Upgrade Form */}
      <form
        onSubmit={handleVerifyPhone}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Verification
          </h3>
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
              user?.phoneNumber
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}
          >
            {user?.phoneNumber ? 'Verified' : 'Unverified'}
          </span>
        </div>

        {phoneSuccess && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Phone number verified & account role updated!</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400">Ethiopian Phone Number (+2519...)</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+251966036251"
            required
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="agentCheck"
            checked={isAgent}
            onChange={(e) => setIsAgent(e.target.checked)}
            className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="agentCheck" className="text-xs text-slate-300 cursor-pointer">
            Register as Verified Real Estate Agent (ደላላ/ወኪል)
          </label>
        </div>

        <button
          type="submit"
          disabled={verifyingPhone}
          className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {verifyingPhone ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" /> Save Verified Contact
            </>
          )}
        </button>
      </form>

      {/* Referral Card */}
      <ReferralCard />

      {/* My Posted Listings */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" /> My Posted Listings (
          {myProperties.length})
        </h3>

        {myProperties.length === 0 ? (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
            <p className="text-xs text-slate-400">You haven't posted any listings yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5 truncate">
                  <h4 className="text-xs font-bold text-white truncate">{prop.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-extrabold">
                      {prop.price.toLocaleString()} ETB
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" /> {prop.viewsCount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    hapticImpact('medium');
                    setSelectedPropertyForPromotion(prop);
                  }}
                  className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                >
                  <Zap className="w-3 h-3 fill-amber-400" /> Promote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotion Modal */}
      {selectedPropertyForPromotion && (
        <PromotionModal
          property={selectedPropertyForPromotion}
          onClose={() => setSelectedPropertyForPromotion(null)}
        />
      )}
    </div>
  );
};
