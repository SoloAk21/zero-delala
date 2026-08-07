import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './providers/TelegramProvider';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './components/home/HomeScreen';
import { SearchScreen } from './components/search/SearchScreen';
import { PostPropertyScreen } from './components/post/PostPropertyScreen';
import { SavedScreen } from './components/saved/SavedScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { useAppStore } from './store/useAppStore';

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

  return (
    <div>
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'search' && <SearchScreen />}
      {activeTab === 'post' && <PostPropertyScreen />}
      {activeTab === 'saved' && <SavedScreen />}
      {activeTab === 'profile' && <ProfileScreen />}
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
