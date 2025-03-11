import { createContext, useContext } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import type { User } from '@supabase/supabase-js';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider');
  }
  return context;
}