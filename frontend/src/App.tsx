import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './components/home/HomeScreen';
import { SearchScreen } from './components/search/SearchScreen';
import { PostPropertyScreen } from './components/post/PostPropertyScreen';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { telegramLoginApi } from './services/authService';
import { Bookmark, User, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

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
  const { hapticImpact, initData } = useTelegram();
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

  return (
    <div>
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'search' && <SearchScreen />}
      {activeTab === 'post' && <PostPropertyScreen />}

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
                  <Sparkles className="w-4 h-4" /> Login Session
                </>
              )}
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
