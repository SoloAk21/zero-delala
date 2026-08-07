import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { usePropertiesQuery } from '../../hooks/useProperties';
import { PropertyMap } from '../map/PropertyMap';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import { Search, Map, List, Loader2, MapPin } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { t, isAmharic } = useTranslation();
  const { hapticImpact } = useTelegram();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [region, setRegion] = useState<string>('Addis Ababa');
  const [subcity, setSubcity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = usePropertiesQuery({
    region: region || undefined,
    subcity: subcity || undefined,
    search: searchQuery || undefined
  });

  const properties = data?.properties || [];

  const toggleViewMode = (mode: 'list' | 'map') => {
    hapticImpact('light');
    setViewMode(mode);
  };

  return (
    <div className="space-y-4">
      {/* Search Header & View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 items-center">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.searchProperties}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => toggleViewMode('map')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleViewMode('list')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Regional Filters */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          {ETHIOPIAN_REGIONS.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        {region === 'Addis Ababa' && (
          <select
            value={subcity}
            onChange={(e) => setSubcity(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Sub-cities (ሁሉም)</option>
            {ADDIS_ABABA_SUBCITIES.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading && (
        <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs">Loading map properties...</span>
        </div>
      )}

      {/* Interactive Map View */}
      {!isLoading && viewMode === 'map' && <PropertyMap properties={properties} />}

      {/* List View */}
      {!isLoading && viewMode === 'list' && (
        <div className="space-y-3">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => hapticImpact('light')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 cursor-pointer"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-base font-extrabold text-emerald-400">
                  {prop.price.toLocaleString()} ETB
                </span>
                <span className="text-xs font-semibold text-slate-400">{prop.areaSqm} m²</span>
              </div>
              <h3 className="text-xs font-bold text-white">
                {isAmharic && prop.titleAmharic ? prop.titleAmharic : prop.title}
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {prop.location?.region}{' '}
                {prop.location?.subcity ? `, ${prop.location.subcity}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
