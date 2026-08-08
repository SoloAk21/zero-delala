import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useReferralInfoQuery } from '../../hooks/useGrowth';
import { Users, Copy, Share2, Gift, Check, Ticket, Sparkles } from 'lucide-react';

export const ReferralCard: React.FC = () => {
  const { isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification, webApp } = useTelegram();
  const { data: refInfo, isLoading } = useReferralInfoQuery();
  const [copied, setCopied] = useState(false);

  const referralLink = refInfo?.referralLink || 'https://t.me/zero_delala_bot/app';

  const handleCopyLink = () => {
    hapticImpact('light');
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    hapticNotification('success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTelegram = () => {
    hapticImpact('heavy');
    const shareText = encodeURIComponent(
      'Join Zero Delala to buy, rent, and sell real estate in Ethiopia without commissions! 🏠'
    );
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`;

    if (webApp && typeof webApp.openTelegramLink === 'function') {
      webApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-400" /> Invite Friends & Earn
        </h3>
        <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
          70% OFF Coupon
        </span>
      </div>

      <p className="text-xs text-slate-400">
        {isAmharic
          ? 'ጓደኞችዎን ይጋብዙ፡ እያንዳንዱ የገባ ጓደኛ ነፃ የቤት መለጠፊያ እና 70% የኪራይ ማስተዋወቂያ ኩፖን ያስኝዎታል።'
          : 'Earn 1 Free Listing + 70% OFF Promotion Coupon for every friend who joins Zero Delala.'}
      </p>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <span className="text-[10px] text-slate-400 block">Total Invites</span>
          <span className="text-sm font-extrabold text-emerald-400">
            {refInfo?.referralCount || 0} Friends
          </span>
        </div>
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <span className="text-[10px] text-slate-400 block">Free Listings Earned</span>
          <span className="text-sm font-extrabold text-amber-400">
            {refInfo?.rewardListingsCount || 0} Credits
          </span>
        </div>
      </div>

      {/* Coupon Wallet Badge */}
      {refInfo?.coupons && refInfo.coupons.length > 0 && (
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Ticket className="w-4 h-4" /> Coupon Wallet ({refInfo.coupons.length})
          </div>
          <span className="text-[10px] text-amber-300 font-medium">30% & 70% OFF Active</span>
        </div>
      )}

      {/* Referral Link Copy & Share Actions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full text-[10px] bg-transparent text-slate-300 focus:outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          onClick={handleShareTelegram}
          className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Invite Friends on Telegram (ጓደኞችን ይጋብዙ)
        </button>
      </div>
    </div>
  );
};
