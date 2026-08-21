export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string | null; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }
        Insert: { id: string; username?: string | null; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; username?: string | null; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      user_preferences: {
        Row: { user_id: string; preferences: Json; updated_at: string }
        Insert: { user_id: string; preferences?: Json; updated_at?: string }
        Update: { user_id?: string; preferences?: Json; updated_at?: string }
        Relationships: []
      }
      continue_watching: {
        Row: { user_id: string; content_key: string; tmdb_id: number; media_type: string; season_number: number | null; episode_number: number | null; progress_seconds: number; duration_seconds: number | null; metadata: Json; updated_at: string }
        Insert: { user_id: string; content_key: string; tmdb_id: number; media_type: string; season_number?: number | null; episode_number?: number | null; progress_seconds?: number; duration_seconds?: number | null; metadata?: Json; updated_at?: string }
        Update: { user_id?: string; content_key?: string; tmdb_id?: number; media_type?: string; season_number?: number | null; episode_number?: number | null; progress_seconds?: number; duration_seconds?: number | null; metadata?: Json; updated_at?: string }
        Relationships: []
      }
      watch_history: {
        Row: { id: string; user_id: string; tmdb_id: number; media_type: string; season_number: number | null; episode_number: number | null; progress_seconds: number; duration_seconds: number | null; metadata: Json; watched_at: string }
        Insert: { id?: string; user_id: string; tmdb_id: number; media_type: string; season_number?: number | null; episode_number?: number | null; progress_seconds?: number; duration_seconds?: number | null; metadata?: Json; watched_at?: string }
        Update: { id?: string; user_id?: string; tmdb_id?: number; media_type?: string; season_number?: number | null; episode_number?: number | null; progress_seconds?: number; duration_seconds?: number | null; metadata?: Json; watched_at?: string }
        Relationships: []
      }
      watchlist: {
        Row: { user_id: string; tmdb_id: number; media_type: string; metadata: Json; added_at: string }
        Insert: { user_id: string; tmdb_id: number; media_type: string; metadata?: Json; added_at?: string }
        Update: { user_id?: string; tmdb_id?: number; media_type?: string; metadata?: Json; added_at?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
