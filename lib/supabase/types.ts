export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string | null; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }
        Insert: { id: string; username?: string | null; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
      user_preferences: {
        Row: { user_id: string; preferences: Json; updated_at: string }
        Insert: { user_id: string; preferences?: Json; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Insert"]>
      }
      watch_history: {
        Row: { id: string; user_id: string; media_type: string; tmdb_id: number; season_number: number | null; episode_number: number | null; watched_at: string; progress_seconds: number; duration_seconds: number | null; metadata: Json }
        Insert: { id?: string; user_id: string; media_type: string; tmdb_id: number; season_number?: number | null; episode_number?: number | null; watched_at?: string; progress_seconds?: number; duration_seconds?: number | null; metadata?: Json }
        Update: Partial<Database["public"]["Tables"]["watch_history"]["Insert"]>
      }
      continue_watching: {
        Row: { user_id: string; content_key: string; media_type: string; tmdb_id: number; season_number: number | null; episode_number: number | null; progress_seconds: number; duration_seconds: number | null; updated_at: string; metadata: Json }
        Insert: { user_id: string; content_key: string; media_type: string; tmdb_id: number; season_number?: number | null; episode_number?: number | null; progress_seconds?: number; duration_seconds?: number | null; updated_at?: string; metadata?: Json }
        Update: Partial<Database["public"]["Tables"]["continue_watching"]["Insert"]>
      }
      watchlist: {
        Row: { user_id: string; media_type: string; tmdb_id: number; added_at: string; metadata: Json }
        Insert: { user_id: string; media_type: string; tmdb_id: number; added_at?: string; metadata?: Json }
        Update: Partial<Database["public"]["Tables"]["watchlist"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
