import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: typeof WebApp;
  user: TelegramUser | null;
  initData: string;
  isReady: boolean;
  hapticImpact: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  hapticNotification: (type: 'error' | 'success' | 'warning') => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();

      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user as TelegramUser);
      }
      if (WebApp.initData) {
        setInitData(WebApp.initData);
      }
    } catch (e) {
      console.warn('Telegram WebApp SDK running outside Telegram client environment');
    } finally {
      setIsReady(true);
    }
  }, []);

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    try {
      WebApp.HapticFeedback.impactOccurred(style);
    } catch (e) {
      // Fallback when running outside Telegram client
    }
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    try {
      WebApp.HapticFeedback.notificationOccurred(type);
    } catch (e) {
      // Fallback when running outside Telegram client
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        webApp: WebApp,
        user,
        initData,
        isReady,
        hapticImpact,
        hapticNotification
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = (): TelegramContextType => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
