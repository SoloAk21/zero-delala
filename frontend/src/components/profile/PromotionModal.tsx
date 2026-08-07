import React, { useState } from 'react';
import { Zap, Star, X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/api';
import { useTelegram } from '../../providers/TelegramProvider';
import { Property } from '../../services/propertyService';

interface PromotionModalProps {
  property: Property;
  onClose: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ property, onClose }) => {
  const { hapticImpact, hapticNotification, webApp } = useTelegram();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInitializePayment = async () => {
    hapticImpact('heavy');
    setLoading(true);

    try {
      const response = await apiClient.post('/payments/initialize', {
        propertyId: property.id,
        amount: selectedAmount
      });

      if (response.data?.data?.checkoutUrl) {
        hapticNotification('success');
        const checkoutUrl = response.data.data.checkoutUrl;

        if (webApp && typeof webApp.openLink === 'function') {
          webApp.openLink(checkoutUrl);
        } else {
          window.open(checkoutUrl, '_blank');
        }

        onClose();
      }
    } catch (err: any) {
      hapticNotification('error');
      alert(err.response?.data?.error?.message || 'Failed to initialize Chapa payment session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Promote Listing</h3>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{property.title}</p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-300">
            Select Promotion Package
          </label>

          <div
            onClick={() => {
              hapticImpact('light');
              setSelectedAmount(500);
            }}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedAmount === 500
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Featured Badge (7
                Days)
              </div>
              <p className="text-[10px] text-slate-400">
                Highlight property card with golden badge
              </p>
            </div>
            <span className="text-xs font-extrabold text-amber-400">500 ETB</span>
          </div>

          <div
            onClick={() => {
              hapticImpact('light');
              setSelectedAmount(1000);
            }}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedAmount === 1000
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Top Priority Placement (14
                Days)
              </div>
              <p className="text-[10px] text-slate-400">
                Pin listing at top of Ethiopian search results
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-400">1,000 ETB</span>
          </div>
        </div>

        {/* Chapa Payment Notice */}
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-[10px] text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Supports Telebirr, CBE Birr, Awash Birr, and Cards via Chapa Gateway.</span>
        </div>

        {/* Submit Checkout Button */}
        <button
          onClick={handleInitializePayment}
          disabled={loading}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Opening Chapa Gateway...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" /> Pay {selectedAmount} ETB with Chapa
            </>
          )}
        </button>
      </div>
    </div>
  );
};
