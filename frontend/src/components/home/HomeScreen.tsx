import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import {
  Search,
  Home,
  Building2,
  Trees,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { hapticImpact } = useTelegram();
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'residential' | 'commercial' | 'land'
  >('all');
  const [selectedListingType, setSelectedListingType] = useState<'all' | 'sale' | 'rent'>('all');

  const handleCategorySelect = (cat: 'all' | 'residential' | 'commercial' | 'land') => {
    hapticImpact('light');
    setSelectedCategory(cat);
  };

  const handleListingTypeSelect = (type: 'all' | 'sale' | 'rent') => {
    hapticImpact('light');
    setSelectedListingType(type);
  };

  // Mock initial property cards for UI verification
  const featuredProperties = [
    {
      id: 'prop_1',
      titleAm: 'በቦሌ ክልል የሚገኝ ዘመናዊ አፓርታማ',
      titleEn: 'Modern 3BR Luxury Apartment in Bole',
      price: 18500000,
      listingType: 'FOR_SALE',
      category: 'RESIDENTIAL',
      location: 'Addis Ababa, Bole',
      areaSqm: 145,
      bedrooms: 3,
      isVerifiedOwner: true,
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'prop_2',
      titleAm: 'በካዛንቺስ የሚገኝ ሰፊ የንግድ ቦታ',
      titleEn: 'Spacious Commercial Office in Cazanchis',
      price: 120000,
      listingType: 'FOR_RENT',
      category: 'COMMERCIAL',
      location: 'Addis Ababa, Kirkos',
      areaSqm: 210,
      bedrooms: 0,
      isVerifiedOwner: true,
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'prop_3',
      titleAm: 'በለሚ ኩራ የሚገኝ የካርታ መሬት',
      titleEn: 'Prime Residential Plot with Title Deed',
      price: 9500000,
      listingType: 'FOR_SALE',
      category: 'LAND',
      location: 'Addis Ababa, Lemi Kura',
      areaSqm: 500,
      bedrooms: 0,
      isVerifiedOwner: true,
      image:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
        <input
          type="text"
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
          onClick={() => handleCategorySelect('residential')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'residential'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">{t.categories.residential}</span>
        </button>

        <button
          onClick={() => handleCategorySelect('commercial')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'commercial'
              ? 'bg-blue-500/10 border-blue-500 text-blue-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-xs font-medium">{t.categories.commercial}</span>
        </button>

        <button
          onClick={() => handleCategorySelect('land')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'land'
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
          onClick={() => handleListingTypeSelect('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {t.nav.home} (ሁሉም)
        </button>
        <button
          onClick={() => handleListingTypeSelect('sale')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === 'sale'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {t.listingTypes.forSale}
        </button>
        <button
          onClick={() => handleListingTypeSelect('rent')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedListingType === 'rent'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {t.listingTypes.forRent}
        </button>
      </div>

      {/* Featured Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Featured Properties
        </h2>
        <span className="text-[10px] text-slate-400">
          {ETHIOPIAN_REGIONS.length} Regions | {ADDIS_ABABA_SUBCITIES.length} Sub-cities
        </span>
      </div>

      {/* Property Cards List */}
      <div className="space-y-3">
        {featuredProperties.map((prop) => (
          <div
            key={prop.id}
            onClick={() => hapticImpact('light')}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
              <img
                src={prop.image}
                alt={prop.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-emerald-400 text-[10px] font-bold rounded-full">
                  {prop.listingType === 'FOR_SALE'
                    ? t.listingTypes.forSale
                    : t.listingTypes.forRent}
                </span>
                {prop.isVerifiedOwner && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-medium rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {t.actions.verifiedOwner}
                  </span>
                )}
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
                {t.appTitle === 'ዜሮ ደላላ' ? prop.titleAm : prop.titleEn}
              </h3>

              <div className="flex items-center text-[11px] text-slate-400 gap-1 pt-1 border-t border-slate-800/60">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{prop.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
