import { LucideIcon } from 'lucide-react'

export interface User {
  id: number
  name: string
  total: number
  avgDaily: number
  position: number
  daysActive: number
  maxStreak: number
  noStreakMax: number
  color: string
}

export interface RangeData {
  name: string
  value: number
  percentage: number
  color: string
}

export interface WeeklyData {
  week: string
  cervezas: number
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

export interface DayEntry {
  date: string
  beers: number
}

export type SectionId = 'overview' | 'statistics' | 'comparisons' | 'profile'
export type Granularity = 'day' | 'week' | 'month'
export type YearFilter = 'current' | 'all' | 2023 | 2024 | 2025 | 2026
