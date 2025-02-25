import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zgdoyxsvwxtnnzsyhkby.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZG95eHN2d3h0bm56c3loa2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1ODE4OTksImV4cCI6MjA1NTE1Nzg5OX0.oXRw7YqtSQieo75FxvYvgC0-W87P-JaQMPvPuhpwPxU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})