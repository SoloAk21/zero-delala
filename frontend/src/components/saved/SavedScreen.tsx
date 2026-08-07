import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useFavoritesQuery, useToggleFavoriteMutation } from '../../hooks/useFavorites';
import { useAuthStore } from '../../store/useAuthStore';
import { Bookmark, Heart, MapPin, Loader2 } from 'lucide-react';

export const SavedScreen: React.FC = () => {
  const { t, isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification } = useTelegram();
  const { isAuthenticated } = useAuthStore();
  const { data: favorites = [], isLoading } = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();

  const handleRemoveFavorite = (propertyId: string) => {
    hapticImpact('medium');
    toggleMutation.mutate(propertyId, {
      onSuccess: () => hapticNotification('success')
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3 my-auto">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
          <Bookmark className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">
          {isAmharic ? 'የተቀመጡ ቤቶችን ለማየት ይግቡ' : 'Login to View Saved Listings'}
        </h2>
        <p className="text-xs text-slate-400">
          {isAmharic
            ? 'የወደዱትን ቤት ወይም መሬት ለማስቀመጥ እና በኋላ ለማየት ይግቡ።'
            : 'Save your favorite real estate listings to compare and contact owners later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-amber-400" /> {t.nav.saved} ({favorites.length})
        </h2>
        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
          Bookmarked Properties
        </span>
      </div>

      {isLoading && (
        <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-xs">Loading saved listings...</span>
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No saved listings yet</p>
          <p className="text-xs text-slate-400">
            Browse properties on the Home tab and tap the bookmark button to save listings.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {favorites.map((prop) => (
          <div
            key={prop.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-2 transition-all relative"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-base font-extrabold text-emerald-400">
                {prop.price.toLocaleString()} ETB
              </span>
              <button
                onClick={() => handleRemoveFavorite(prop.id)}
                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              </button>
            </div>

            <h3 className="text-xs font-bold text-white line-clamp-1">
              {isAmharic && prop.titleAmharic ? prop.titleAmharic : prop.title}
            </h3>

            <div className="flex items-center text-[11px] text-slate-400 gap-1 pt-1 border-t border-slate-800/60">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {prop.location?.region} {prop.location?.subcity ? `, ${prop.location.subcity}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
