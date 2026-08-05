import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';
import { Building2, Globe, Sparkles, UserCheck } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function Dashboard() {
  const { hapticImpact } = useTelegram();
  const { language, setLanguage } = useAppStore();
  const { isAuthenticated, setAuth, logout, user } = useAuthStore();

  const toggleLanguage = () => {
    hapticImpact('light');
    setLanguage(language === 'am' ? 'en' : 'am');
  };

  const simulateLogin = () => {
    hapticImpact('medium');
    setAuth('mock_jwt_token_2026', {
      id: 'usr_mock_123',
      telegramId: '987654321',
      firstName: 'Abebe',
      lastName: 'Bikila',
      username: 'abebe_b',
      isVerifiedAgent: true,
      role: 'AGENT'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zero Delala (ዜሮ ደላላ)</h1>
          <p className="text-slate-400 text-sm mt-1">
            {language === 'am'
              ? 'የኢትዮጵያ የቤት እና መሬት መተግበሪያ'
              : 'Ethiopian Real Estate Telegram Mini App'}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" /> Language
            </span>
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded cursor-pointer hover:bg-amber-500/20 transition-all"
            >
              {language === 'am' ? 'አማርኛ (AM)' : 'English (EN)'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Auth Session
            </span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${isAuthenticated ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-700/50'}`}
            >
              {isAuthenticated ? 'Authenticated' : 'Guest Mode'}
            </span>
          </div>
        </div>

        {!isAuthenticated ? (
          <button
            onClick={simulateLogin}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Simulate Auth Session
          </button>
        ) : (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-emerald-400">
              Logged in: {user?.firstName} {user?.lastName} (@{user?.username}) [{user?.role}]
            </p>
            <button
              onClick={() => {
                hapticImpact('heavy');
                logout();
              }}
              className="w-full py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-lg text-xs transition-all cursor-pointer"
            >
              Logout Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <Dashboard />
      </TelegramProvider>
    </QueryClientProvider>
  );
}
