import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertiesQuery } from '../../hooks/useProperties';
import { telegramLoginApi } from '../../services/authService';
import { apiClient } from '../../services/api';
import { PromotionModal } from './PromotionModal';
import { Property } from '../../services/propertyService';
import {
  User,
  ShieldCheck,
  Phone,
  Building2,
  Sparkles,
  Loader2,
  CheckCircle,
  Eye,
  LogOut,
  Zap
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification, initData } = useTelegram();
  const { isAuthenticated, setAuth, logout, user } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+251911223344');
  const [isAgent, setIsAgent] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedPropertyForPromotion, setSelectedPropertyForPromotion] = useState<Property | null>(
    null
  );

  const { data: propertiesData } = usePropertiesQuery();
  const myProperties = (propertiesData?.properties || []).filter(
    (p) => p.owner?.id === user?.id || isAuthenticated
  );

  const handleAuthenticate = async () => {
    hapticImpact('medium');
    setLoginLoading(true);
    try {
      const payloadInitData =
        initData ||
        'user=%7B%22id%22%3A987654321%2C%22first_name%22%3A%22Abebe%22%2C%22last_name%22%3A%22Bikila%22%2C%22username%22%3A%22abebe_b%22%7D&auth_date=1700000000&hash=mock_hash';

      const result = await telegramLoginApi(payloadInitData);
      if (result) {
        setAuth(result.token, result.user);
      }
    } catch (err) {
      console.error('Authentication failed:', err);
    } finally {
      setLoginLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 my-auto">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">
          {isAmharic ? 'የእርስዎን መገለጫ ለማየት ይግቡ' : 'Login to View User Dashboard'}
        </h2>
        <p className="text-xs text-slate-400">
          {isAmharic
            ? 'የለጠፉትን ንብረት ለማስተዳደር እና ስልክ ቁጥርዎን ለማረጋገጥ ይግቡ።'
            : 'Manage posted listings, verify your phone number, and promote properties.'}
        </p>
        <button
          onClick={handleAuthenticate}
          disabled={loginLoading}
          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loginLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Authenticate Session
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              {user?.isVerifiedAgent && (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              @{user?.username || 'no_username'} •{' '}
              <span className="text-emerald-400 font-semibold">{user?.role}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            hapticImpact('heavy');
            logout();
          }}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Phone Number & Verification Upgrade Form */}
      <form
        onSubmit={handleVerifyPhone}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Verification
          </h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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
            placeholder="+251911223344"
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

      {/* My Posted Listings */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" /> My Posted Listings (
          {myProperties.length})
        </h3>

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
