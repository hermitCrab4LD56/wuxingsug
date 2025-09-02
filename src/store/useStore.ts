import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  phone: string;
  gender: 'male' | 'female';
  birth_date: string;
  birth_time: string;
  plan: 'basic' | 'vip';
}

export interface DetailedAnalysis {
  balance: string;
  personality: string;
  fortune: string;
  suggestions: string;
}

export interface BaziInfo {
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  wuxing_analysis: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  analysis_text: string;
  detailed_analysis?: DetailedAnalysis;
}

export interface DailyAdvice {
  date: string;
  clothing_colors: string[];
  avoid_colors: string[];
  travel_direction: string;
  lucky_times: string[];
  suggestions: string;
}

interface AppState {
  // 用户相关
  user: User | null;
  isAuthenticated: boolean;
  
  // 八字信息
  baziInfo: BaziInfo | null;
  
  // 每日建议
  dailyAdvice: DailyAdvice | null;
  
  // 弹窗状态
  showDailyPopup: boolean;
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setBaziInfo: (bazi: BaziInfo) => void;
  setDailyAdvice: (advice: DailyAdvice) => void;
  setShowDailyPopup: (show: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      baziInfo: null,
      dailyAdvice: null,
      showDailyPopup: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, baziInfo: null }),
      setBaziInfo: (info) => {
        console.log('🏪 Store setBaziInfo: 更新八字信息', {
          has_info: !!info,
          has_detailed_analysis: info?.detailed_analysis ? true : false,
          wuxing_analysis: info?.wuxing_analysis,
          detailed_analysis_keys: info?.detailed_analysis ? Object.keys(info.detailed_analysis) : null
        });
        set({ baziInfo: info });
      },
      setDailyAdvice: (dailyAdvice) => set({ dailyAdvice }),
      setShowDailyPopup: (showDailyPopup) => set({ showDailyPopup }),
    }),
    {
      name: 'wuxing-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        baziInfo: state.baziInfo,
      }),
    }
  )
);