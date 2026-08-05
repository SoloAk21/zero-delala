import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './components/home/HomeScreen';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { Search, PlusCircle, Bookmark, User, ShieldCheck, Sparkles } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function MainView() {
  const { activeTab } = useAppStore();
  const { isAuthenticated, setAuth, logout, user } = useAuthStore();
  const { hapticImpact } = useTelegram();

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
    <div>
      {activeTab === 'home' && <HomeScreen />}

      {activeTab === 'search' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Search & Filter / ፈልግ</h2>
          <p className="text-xs text-slate-400">
            Search properties by Regions, Addis Ababa Sub-Cities, and Prices.
          </p>
        </div>
      )}

      {activeTab === 'post' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Post Property / ለጥፍ</h2>
          <p className="text-xs text-slate-400">
            List residential, commercial, or land properties directly.
          </p>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Saved Properties / የተቀመጡ</h2>
          <p className="text-xs text-slate-400">View bookmarked real estate listings.</p>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">User Profile / መገለጫ</h2>

          {!isAuthenticated ? (
            <button
              onClick={simulateLogin}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" /> Login Session
            </button>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> {user?.firstName} {user?.lastName} ({user?.role}
                )
              </div>
              <button
                onClick={() => {
                  hapticImpact('heavy');
                  logout();
                }}
                className="w-full py-2 px-3 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <AppLayout>
          <MainView />
        </AppLayout>
      </TelegramProvider>
    </QueryClientProvider>
  );
}
