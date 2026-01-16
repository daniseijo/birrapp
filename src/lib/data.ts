import { BarChart3, Home, User as UserIcon, Users } from 'lucide-react'
import { NavItem, RangeData, User } from './types'

export const USERS: User[] = [
  {
    id: 1,
    name: 'Seijo',
    total: 1066,
    avgDaily: 3,
    position: 3,
    daysActive: 291,
    maxStreak: 26,
    noStreakMax: 4,
    color: '#F59E0B',
  },
  {
    id: 2,
    name: 'José',
    total: 1243,
    avgDaily: 3.4,
    position: 1,
    daysActive: 312,
    maxStreak: 31,
    noStreakMax: 3,
    color: '#EF4444',
  },
  {
    id: 3,
    name: 'Carlos',
    total: 1189,
    avgDaily: 3.3,
    position: 2,
    daysActive: 298,
    maxStreak: 28,
    noStreakMax: 5,
    color: '#3B82F6',
  },
  {
    id: 4,
    name: 'Dani M',
    total: 987,
    avgDaily: 2.7,
    position: 4,
    daysActive: 276,
    maxStreak: 22,
    noStreakMax: 6,
    color: '#10B981',
  },
  {
    id: 5,
    name: 'Javi',
    total: 424,
    avgDaily: 1.2,
    position: 5,
    daysActive: 189,
    maxStreak: 15,
    noStreakMax: 12,
    color: '#8B5CF6',
  },
]

export const RANGE_DATA: RangeData[] = [
  { name: '1-2 🍺', value: 125, percentage: 43.0, color: '#FEF3C7' },
  { name: '3-5 🍺', value: 103, percentage: 35.4, color: '#FDE68A' },
  { name: '6-9 🍺', value: 48, percentage: 16.5, color: '#FCD34D' },
  { name: '10+ 🍺', value: 15, percentage: 5.2, color: '#FBBF24' },
]

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Resumen', icon: Home },
  { id: 'statistics', label: 'Estadísticas', icon: BarChart3 },
  { id: 'comparisons', label: 'Comparativas', icon: Users },
  { id: 'profile', label: 'Perfil', icon: UserIcon },
]
