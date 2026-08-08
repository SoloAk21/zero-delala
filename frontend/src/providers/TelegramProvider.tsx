import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { telegramLoginApi } from '../services/authService';
import { attributeReferralApi } from '../services/growthService';
import { useAuthStore } from '../store/useAuthStore';

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
  startParam: string | null;
  hapticImpact: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  hapticNotification: (type: 'error' | 'success' | 'warning') => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>('');
  const [startParam, setStartParam] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const initializeTelegramSession = async () => {
      try {
        WebApp.ready();
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe?.user as TelegramUser | undefined;
        const tgInitData = WebApp.initData || '';
        const param = WebApp.initDataUnsafe?.start_param || null;

        if (tgUser) setUser(tgUser);
        if (tgInitData) setInitData(tgInitData);
        if (param) setStartParam(param);

        // Auto-authenticate with backend on launch
        const authPayload =
          tgInitData ||
          `user=${encodeURIComponent(
            JSON.stringify({
              id: tgUser?.id || 8580032836,
              first_name: tgUser?.first_name || 'Solo',
              last_name: tgUser?.last_name || 'Ak',
              username: tgUser?.username || 'SoloAk21'
            })
          )}&auth_date=1700000000&hash=mock_hash`;

        const authResult = await telegramLoginApi(authPayload);
        if (authResult?.token && authResult?.user) {
          setAuth(authResult.token, authResult.user);

          // If launched via referral link (startapp=ref_xxx), attribute referral
          if (param && param.startsWith('ref_')) {
            await attributeReferralApi(param);
          }
        }
      } catch (e) {
        console.warn('Auto-login outside native Telegram client, using session fallback');
      } finally {
        setIsReady(true);
      }
    };

    initializeTelegramSession();
  }, [setAuth]);

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    try {
      WebApp.HapticFeedback.impactOccurred(style);
    } catch (e) {
      // Browser fallback
    }
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    try {
      WebApp.HapticFeedback.notificationOccurred(type);
    } catch (e) {
      // Browser fallback
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        webApp: WebApp,
        user,
        initData,
        isReady,
        startParam,
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
