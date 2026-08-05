import React from 'react';
import { Home, Search, PlusCircle, Bookmark, User } from 'lucide-react';
import { useAppStore, NavigationTab } from '../../store/useAppStore';
import { useTelegram } from '../../providers/TelegramProvider';
import { useTranslation } from '../../hooks/useTranslation';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const { hapticImpact } = useTelegram();
  const { t } = useTranslation();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'search', label: t.nav.search, icon: Search },
    { id: 'post', label: t.nav.post, icon: PlusCircle },
    { id: 'saved', label: t.nav.saved, icon: Bookmark },
    { id: 'profile', label: t.nav.profile, icon: User }
  ];

  const handleTabChange = (tab: NavigationTab) => {
    hapticImpact('light');
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all rounded-xl cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-emerald-500/10' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'stroke-[1.75]'}`}
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
