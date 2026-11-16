
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = 'https://rhilxuhurqductkswent.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lMbj_fBL56FrUKpspIRRQA_B1L2Ybuj';

const webStorage = {
  getItem: async (key) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },

  setItem: async (key, value) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },

  removeItem: async (key) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
