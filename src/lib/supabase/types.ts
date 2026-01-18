export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      beer_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          beers: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          beers: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          beers?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_yearly_stats: {
        Row: {
          user_id: string
          name: string
          color: string
          year: number
          days_active: number
          total_beers: number
          avg_daily: number
          max_daily: number
          first_entry: string | null
          last_entry: string | null
        }
      }
      yearly_ranking: {
        Row: {
          user_id: string
          name: string
          color: string
          year: number
          total_beers: number
          avg_daily: number
          days_active: number
          position: number
        }
      }
      user_weekday_stats: {
        Row: {
          user_id: string
          name: string
          year: number
          day_of_week: number
          day_name: string
          days_count: number
          total_beers: number
          avg_beers: number
        }
      }
      user_monthly_stats: {
        Row: {
          user_id: string
          name: string
          year: number
          month: number
          month_name: string
          days_active: number
          total_beers: number
          avg_daily: number
          max_daily: number
        }
      }
      user_range_distribution: {
        Row: {
          user_id: string
          name: string
          year: number
          range_label: string
          days_count: number
        }
      }
      group_yearly_stats: {
        Row: {
          year: number
          active_users: number
          days_with_entries: number
          total_group_beers: number
          avg_daily_per_entry: number
          max_single_entry: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BeerEntry = Database['public']['Tables']['beer_entries']['Row']
export type NewBeerEntry = Database['public']['Tables']['beer_entries']['Insert']

// View types
export type UserYearlyStats = Database['public']['Views']['user_yearly_stats']['Row']
export type YearlyRanking = Database['public']['Views']['yearly_ranking']['Row']
export type UserWeekdayStats = Database['public']['Views']['user_weekday_stats']['Row']
export type UserMonthlyStats = Database['public']['Views']['user_monthly_stats']['Row']
export type UserRangeDistribution = Database['public']['Views']['user_range_distribution']['Row']
export type GroupYearlyStats = Database['public']['Views']['group_yearly_stats']['Row']
