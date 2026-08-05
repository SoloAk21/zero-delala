import { create } from 'zustand';

export type Language = 'am' | 'en';
export type NavigationTab = 'home' | 'search' | 'post' | 'saved' | 'profile';

interface AppState {
  language: Language;
  activeTab: NavigationTab;
  setLanguage: (language: Language) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: (localStorage.getItem('zd_lang') as Language) || 'am',
  activeTab: 'home',
  setLanguage: (language) => {
    localStorage.setItem('zd_lang', language);
    set({ language });
  },
  setActiveTab: (tab) => set({ activeTab: tab })
}));
