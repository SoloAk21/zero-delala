import React from 'react';
import { BottomNav } from './BottomNav';
import { useAppStore } from '../../store/useAppStore';
import { useTelegram } from '../../providers/TelegramProvider';
import { Building2, Globe } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useAppStore();
  const { hapticImpact } = useTelegram();

  const toggleLanguage = () => {
    hapticImpact('light');
    setLanguage(language === 'am' ? 'en' : 'am');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 select-none">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none text-white">
              Zero Delala <span className="text-emerald-400 font-normal text-xs">| ዜሮ ደላላ</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {language === 'am' ? 'ኮሚሽን የሌለው የቤትና መሬት ገበያ' : 'Commission-free Real Estate'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-emerald-400 flex items-center gap-1 transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'am' ? 'አማርኛ' : 'EN'}</span>
        </button>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-md mx-auto w-full p-4">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
