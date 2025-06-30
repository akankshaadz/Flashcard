import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          category: string
          created_at: string
          viewed_by: string[]
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          answer: string
          category: string
          created_at?: string
          viewed_by?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          answer?: string
          category?: string
          created_at?: string
          viewed_by?: string[]
        }
      }
    }
  }
}