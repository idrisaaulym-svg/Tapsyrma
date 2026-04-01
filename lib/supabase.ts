import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Тек дұрыс URL бар болса ғана Supabase клиентін құру
export const supabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export interface StudentAnswer {
  id?: number
  student_name: string
  answers: Record<string, string>
  score: number
  grade: number
  created_at?: string
}
