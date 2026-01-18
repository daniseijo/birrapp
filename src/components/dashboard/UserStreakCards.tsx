'use client'

import { useEffect, useState } from 'react'
import { Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { YearFilter } from '@/lib/types'
import { StreakCard } from './StreakCard'

interface UserStreakCardsProps {
  userId: string
  yearFilter: YearFilter
}

interface StreakData {
  maxDrinkingStreak: number
  maxSoberStreak: number
}

export const UserStreakCards: React.FC<UserStreakCardsProps> = ({ userId, yearFilter }) => {
  const [streaks, setStreaks] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStreaks = async () => {
      setLoading(true)
      const supabase = createClient()

      const currentYear = new Date().getFullYear()
      const yearToFilter = yearFilter === 'current' ? currentYear : yearFilter

      let query = supabase.from('beer_entries').select('date, beers').eq('user_id', userId).order('date', { ascending: true })

      if (typeof yearToFilter === 'number') {
        query = query.gte('date', `${yearToFilter}-01-01`).lte('date', `${yearToFilter}-12-31`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching streaks:', error)
        setLoading(false)
        return
      }

      const entries = (data || []) as Array<{ date: string; beers: number }>

      // Calculate streaks
      let maxDrinkingStreak = 0
      let maxSoberStreak = 0
      let currentDrinkingStreak = 0
      let currentSoberStreak = 0

      // Sort entries by date and iterate
      const sortedEntries = entries.sort((a, b) => a.date.localeCompare(b.date))

      for (let i = 0; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i]

        if (entry.beers > 0) {
          // Drinking day
          currentDrinkingStreak++
          maxDrinkingStreak = Math.max(maxDrinkingStreak, currentDrinkingStreak)
          currentSoberStreak = 0
        } else {
          // Sober day
          currentSoberStreak++
          maxSoberStreak = Math.max(maxSoberStreak, currentSoberStreak)
          currentDrinkingStreak = 0
        }

        // Check for gaps between dates (days without entries)
        if (i < sortedEntries.length - 1) {
          const currentDate = new Date(entry.date)
          const nextDate = new Date(sortedEntries[i + 1].date)
          const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

          if (daysDiff > 1) {
            // Gap in data - reset both streaks
            currentDrinkingStreak = 0
            currentSoberStreak = 0
          }
        }
      }

      setStreaks({
        maxDrinkingStreak,
        maxSoberStreak,
      })
      setLoading(false)
    }

    fetchStreaks()
  }, [userId, yearFilter])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    )
  }

  if (!streaks) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StreakCard
        title="Racha bebiendo"
        value={streaks.maxDrinkingStreak}
        subtitle="días consecutivos"
        icon={TrendingUp}
        className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"
      />
      <StreakCard
        title="Racha sin beber"
        value={streaks.maxSoberStreak}
        subtitle="días consecutivos"
        icon={Calendar}
        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
      />
    </div>
  )
}
