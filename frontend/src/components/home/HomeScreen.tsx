import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { usePropertiesQuery } from '../../hooks/useProperties';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import {
  Search,
  Home,
  Building2,
  Trees,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Loader2,
  Eye
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { t, isAmharic } = useTranslation();
  const { hapticImpact } = useTelegram();
  const [selectedCategory, setSelectedCategory] = useState<
    'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | undefined
  >(undefined);
  const [selectedListingType, setSelectedListingType] = useState<
    'FOR_SALE' | 'FOR_RENT' | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading, isError } = usePropertiesQuery({
    category: selectedCategory,
    listingType: selectedListingType,
    search: searchQuery || undefined
  });

  const properties = data?.properties || [];

  const handleCategoryToggle = (cat: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND') => {
    hapticImpact('light');
    setSelectedCategory((prev) => (prev === cat ? undefined : cat));
  };

  const handleListingTypeToggle = (type: 'FOR_SALE' | 'FOR_RENT') => {
    hapticImpact('light');
    setSelectedListingType((prev) => (prev === type ? undefined : type));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.actions.searchProperties}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          onClick={() => hapticImpact('medium')}
          className="absolute right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleCategoryToggle('RESIDENTIAL')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'RESIDENTIAL'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">{t.categories.residential}</span>
        </button>

        <button
          onClick={() => handleCategoryToggle('COMMERCIAL')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'COMMERCIAL'
              ? 'bg-blue-500/10 border-blue-500 text-blue-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-xs font-medium">{t.categories.commercial}</span>
        </button>

        <button
          onClick={() => handleCategoryToggle('LAND')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'LAND'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trees className="w-5 h-5" />
          <span className="text-xs font-medium">{t.categories.land}</span>
        </button>
      </div>

      {/* Listing Type Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => {
            hapticImpact('light');
            setSelectedListingType(undefined);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === undefined
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          All (ሁሉም)
        </button>
        <button
          onClick={() => handleListingTypeToggle('FOR_SALE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === 'FOR_SALE'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {t.listingTypes.forSale}
        </button>
        <button
          onClick={() => handleListingTypeToggle('FOR_RENT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === 'FOR_RENT'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {t.listingTypes.forRent}
        </button>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Active Listings ({properties.length})
        </h2>
        <span className="text-[10px] text-slate-400">
          {ETHIOPIAN_REGIONS.length} Regions | {ADDIS_ABABA_SUBCITIES.length} Sub-cities
        </span>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs">Loading real estate listings from PostgreSQL...</span>
        </div>
      )}

      {/* Error Indicator */}
      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 text-xs">
          Failed to fetch real estate listings. Ensure Express backend is running.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && properties.length === 0 && (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
          <p className="text-sm font-bold text-white">No properties found</p>
          <p className="text-xs text-slate-400">
            Be the first to post a property listing or adjust your filters.
          </p>
        </div>
      )}

      {/* Property Cards List */}
      <div className="space-y-3">
        {properties.map((prop) => (
          <div
            key={prop.id}
            onClick={() => hapticImpact('light')}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden flex items-center justify-center">
              {prop.images.length > 0 ? (
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Building2 className="w-12 h-12 text-slate-600" />
              )}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-emerald-400 text-[10px] font-bold rounded-full">
                  {prop.listingType === 'FOR_SALE'
                    ? t.listingTypes.forSale
                    : t.listingTypes.forRent}
                </span>
                {prop.owner?.isVerifiedAgent && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-medium rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {t.actions.verifiedOwner}
                  </span>
                )}
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-slate-300 flex items-center gap-1 border border-slate-800">
                <Eye className="w-3 h-3 text-emerald-400" /> {prop.viewsCount} views
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-extrabold text-emerald-400">
                  {prop.price.toLocaleString()} ETB
                  {prop.listingType === 'FOR_RENT' && (
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{prop.areaSqm} m²</span>
              </div>

              <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {isAmharic && prop.titleAmharic ? prop.titleAmharic : prop.title}
              </h3>

              <div className="flex items-center text-[11px] text-slate-400 gap-1 pt-1 border-t border-slate-800/60">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {prop.location?.region}{' '}
                  {prop.location?.subcity ? `, ${prop.location.subcity}` : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
