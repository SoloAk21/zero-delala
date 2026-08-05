import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import { Building2, MapPin, Smartphone, Sparkles } from 'lucide-react';

function Dashboard() {
  const { user, isReady, hapticImpact } = useTelegram();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zero Delala (ዜሮ ደላላ)</h1>
          <p className="text-slate-400 text-sm mt-1">Ethiopian Real Estate Telegram Mini App</p>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-400" /> Telegram SDK
            </span>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
              {isReady ? 'SDK Initialized' : 'Loading...'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Supported Regions
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              {ETHIOPIAN_REGIONS.length} Regions
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" /> Addis Ababa Sub-Cities
            </span>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
              {ADDIS_ABABA_SUBCITIES.length} Sub-Cities
            </span>
          </div>
        </div>

        <button
          onClick={() => hapticImpact('medium')}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Test Haptic Feedback
        </button>

        {user && (
          <p className="text-xs text-emerald-400 pt-2">
            Logged in as Telegram User: {user.first_name} (@{user.username || 'no_username'})
          </p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TelegramProvider>
      <Dashboard />
    </TelegramProvider>
  );
}
