import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // 缺少環境變數時明確報錯，避免像舊版那樣默默連到別人的資料庫
  throw new Error(
    '缺少 Supabase 環境變數：請設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY（見 .env.example）'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
