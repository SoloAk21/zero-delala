import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { useCreatePropertyMutation } from '../../hooks/useProperties';
import { telegramLoginApi } from '../../services/authService';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import { Building2, Home, Trees, CheckCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const PostPropertyScreen: React.FC = () => {
  const { t, isAmharic } = useTranslation();
  const { hapticImpact, hapticNotification, initData } = useTelegram();
  const { isAuthenticated, setAuth } = useAuthStore();
  const createMutation = useCreatePropertyMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'LAND'>('RESIDENTIAL');
  const [listingType, setListingType] = useState<'FOR_SALE' | 'FOR_RENT'>('FOR_SALE');
  const [price, setPrice] = useState('');
  const [areaSqm, setAreaSqm] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [region, setRegion] = useState('Addis Ababa');
  const [subcity, setSubcity] = useState('Bole');
  const [successMessage, setSuccessMessage] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticImpact('heavy');

    if (!title || !description || !price || !areaSqm) {
      hapticNotification('error');
      return;
    }

    createMutation.mutate(
      {
        title,
        titleAmharic: isAmharic ? title : undefined,
        description,
        category,
        listingType,
        price: Number(price),
        areaSqm: Number(areaSqm),
        bedrooms: category === 'RESIDENTIAL' ? Number(bedrooms) : 0,
        bathrooms: category === 'RESIDENTIAL' ? Number(bathrooms) : 0,
        location: {
          region,
          subcity: region === 'Addis Ababa' ? subcity : undefined
        }
      },
      {
        onSuccess: () => {
          hapticNotification('success');
          setSuccessMessage(true);
          setTitle('');
          setDescription('');
          setPrice('');
          setAreaSqm('');
          setTimeout(() => setSuccessMessage(false), 4000);
        },
        onError: () => {
          hapticNotification('error');
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 my-auto">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">
          {isAmharic ? 'ንብረት ለመለጠፍ እባክዎ ይግቡ' : 'Login Required to Post Property'}
        </h2>
        <p className="text-xs text-slate-400">
          {isAmharic
            ? 'የእርስዎን ቤት ወይም መሬት ለመሸጥ ወይም ለማከራየት ይግቡ።'
            : 'Authenticate to post residential, commercial, or land listings directly.'}
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
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-emerald-400" /> Post Property Listing
        </h2>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
          Commission Free
        </span>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Property posted successfully to Zero Delala database!</span>
        </div>
      )}

      {createMutation.isError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Failed to post property. Please check inputs or session token.</span>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-300">Category / ዓይነት</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              setCategory('RESIDENTIAL');
            }}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-medium cursor-pointer transition-all ${
              category === 'RESIDENTIAL'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.categories.residential}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              setCategory('COMMERCIAL');
            }}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-medium cursor-pointer transition-all ${
              category === 'COMMERCIAL'
                ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.categories.commercial}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              setCategory('LAND');
            }}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-medium cursor-pointer transition-all ${
              category === 'LAND'
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>{t.categories.land}</span>
          </button>
        </div>
      </div>

      {/* Listing Type Toggle */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-300">
          Listing Type / የግብይት ዓይነት
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              setListingType('FOR_SALE');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              listingType === 'FOR_SALE'
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {t.listingTypes.forSale}
          </button>
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              setListingType('FOR_RENT');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              listingType === 'FOR_RENT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {t.listingTypes.forRent}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-300">Listing Title / አርእስት</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Modern 3BR Luxury Apartment in Bole"
          required
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-300">Description / ማብራሪያ</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide detailed description of the property..."
          rows={3}
          required
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      {/* Price & Area */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Price (ETB)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 15000000"
            required
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Area (SQM / ካሬ)</label>
          <input
            type="number"
            value={areaSqm}
            onChange={(e) => setAreaSqm(e.target.value)}
            placeholder="e.g. 180"
            required
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bedrooms / Bathrooms for Residential */}
      {category === 'RESIDENTIAL' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Bedrooms / መኝታ</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Bedrooms
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Bathrooms / መታጠቢያ</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Bathrooms
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Ethiopian Location Selectors */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Region / ክልል</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {ETHIOPIAN_REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {region === 'Addis Ababa' && (
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Sub-City / ክፍለ ከተማ</label>
            <select
              value={subcity}
              onChange={(e) => setSubcity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {ADDIS_ABABA_SUBCITIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
      >
        {createMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Publishing Listing...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" /> Publish Listing (ለጥፍ)
          </>
        )}
      </button>
    </form>
  );
};
