import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useCheckMembershipQuery, useVerifyMembershipMutation } from '../../hooks/useGrowth';
import { MessageSquare, ShieldCheck, Loader2, ExternalLink, CheckCircle } from 'lucide-react';

export const ChannelGateModal: React.FC = () => {
  const { isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification, webApp, user } = useTelegram();
  const { data: membership, isLoading } = useCheckMembershipQuery();
  const verifyMutation = useVerifyMembershipMutation();
  const [verifying, setVerifying] = useState(false);

  if (isLoading || membership?.isMember) {
    return null;
  }

  const channelUsername = membership?.channelUsername || '@ZeroDelala';
  const joinUrl = membership?.joinUrl || `https://t.me/ZeroDelala`;

  const handleJoinChannel = () => {
    hapticImpact('heavy');
    if (webApp && typeof webApp.openTelegramLink === 'function') {
      webApp.openTelegramLink(joinUrl);
    } else {
      window.open(joinUrl, '_blank');
    }
  };

  const handleVerifyMembership = () => {
    hapticImpact('medium');
    setVerifying(true);

    verifyMutation.mutate(user?.id, {
      onSuccess: (data) => {
        setVerifying(false);
        if (data?.isMember) {
          hapticNotification('success');
        } else {
          hapticNotification('warning');
        }
      },
      onError: () => {
        setVerifying(false);
        hapticNotification('error');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-2xl relative">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
          <MessageSquare className="w-7 h-7" />
        </div>

        <div>
          <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase">
            Official Channel Gate
          </span>
          <h2 className="text-base font-bold text-white mt-2">
            {isAmharic ? 'የቴሌግራም ቻናላችንን ይቀላቀሉ' : 'Join Official Telegram Channel'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAmharic
              ? 'መተግበሪያውን ለመጠቀም እና ነፃ የቤት መለጠፊያ ኩፖን ለማግኘት ይቀላቀሉ፡'
              : 'Subscribe to unlock the real estate marketplace and receive free listing vouchers.'}
          </p>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 text-left text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{channelUsername}</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-6">
            Direct zero-commission property alerts & instant owner contact.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          {/* Step 1: Join Channel CTA */}
          <button
            onClick={handleJoinChannel}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isAmharic ? 'ቻናሉን ተቀላቀል (Join Channel)' : '1. Join @ZeroDelala Channel'}</span>
          </button>

          {/* Step 2: Verify Membership CTA */}
          <button
            onClick={handleVerifyMembership}
            disabled={verifying}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Verifying
                Membership...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAmharic ? 'ተቀላቅያለሁ - አረጋግጥ' : '2. Check Membership & Continue'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
