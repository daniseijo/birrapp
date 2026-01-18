'use client'

import { useEffect, useState } from 'react'
import { Award, Beer, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { YearlyRanking } from '@/lib/supabase/types'
import { YearFilter } from '@/lib/types'
import { StatCard } from './StatCard'

interface UserStatsCardsProps {
  userId: string
  yearFilter: YearFilter
}

interface UserStats {
  totalBeers: number
  avgDaily: number
  daysActive: number
  position: number
  groupTotal: number
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ userId, yearFilter }) => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const supabase = createClient()

      const currentYear = new Date().getFullYear()
      const yearToFilter = yearFilter === 'current' ? currentYear : yearFilter

      let query = supabase
        .from('yearly_ranking')
        .select('user_id, name, color, year, total_beers, avg_daily, days_active, position')
        .order('position', { ascending: true })

      if (typeof yearToFilter === 'number') {
        query = query.eq('year', yearToFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
        return
      }

      const rows = (data || []) as YearlyRanking[]

      if (yearFilter === 'all' && rows.length > 0) {
        // Aggregate all years
        const userMap = new Map<string, YearlyRanking>()
        for (const row of rows) {
          const existing = userMap.get(row.user_id)
          if (existing) {
            existing.total_beers += row.total_beers
            existing.days_active += row.days_active
          } else {
            userMap.set(row.user_id, { ...row })
          }
        }
        const aggregated = Array.from(userMap.values())
        aggregated.forEach((u) => {
          u.avg_daily = Number((u.total_beers / u.days_active).toFixed(2))
        })
        aggregated.sort((a, b) => b.total_beers - a.total_beers)
        aggregated.forEach((u, idx) => {
          u.position = idx + 1
        })

        const user = aggregated.find((u) => u.user_id === userId) || aggregated[0]
        const groupTotal = aggregated.reduce((sum, u) => sum + u.total_beers, 0)

        if (user) {
          setStats({
            totalBeers: user.total_beers,
            avgDaily: user.avg_daily,
            daysActive: user.days_active,
            position: user.position,
            groupTotal,
          })
        }
      } else if (rows.length > 0) {
        const user = rows.find((u) => u.user_id === userId) || rows[0]
        const groupTotal = rows.reduce((sum, u) => sum + u.total_beers, 0)

        setStats({
          totalBeers: user.total_beers,
          avgDaily: user.avg_daily,
          daysActive: user.days_active,
          position: user.position,
          groupTotal,
        })
      }

      setLoading(false)
    }

    fetchStats()
  }, [userId, yearFilter])

  const userPercentage = stats ? ((stats.totalBeers / stats.groupTotal) * 100).toFixed(1) : '0'
  const daysInYear = yearFilter === 'all' ? stats?.daysActive || 365 : 365
  const daysPercentage = stats ? ((stats.daysActive / daysInYear) * 100).toFixed(1) : '0'

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-4">
      <StatCard
        title="Total del año"
        value={stats.totalBeers.toLocaleString()}
        subtitle="cervezas bebidas"
        icon={Beer}
        highlight
        position={stats.position}
      />
      <StatCard title="Media diaria" value={stats.avgDaily} subtitle="cervezas por día" icon={TrendingUp} />
      <StatCard title="Días activos" value={stats.daysActive} subtitle={`${daysPercentage}% del año`} icon={Calendar} />
      <StatCard
        title="Posición"
        value={`#${stats.position}`}
        subtitle={`${userPercentage}% del grupo`}
        icon={Award}
      />
    </div>
  )
}
