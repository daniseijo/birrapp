'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { YearlyRanking } from '@/lib/supabase/types'
import { YearFilter } from '@/lib/types'

interface RankingCardProps {
  currentUserId?: string
  yearFilter: YearFilter
}

export const RankingCard: React.FC<RankingCardProps> = ({ currentUserId, yearFilter }) => {
  const [ranking, setRanking] = useState<YearlyRanking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true)
      const supabase = createClient()

      const currentYear = new Date().getFullYear()
      const yearToFilter = yearFilter === 'current' ? currentYear : yearFilter

      // Construir query base
      let query = supabase
        .from('yearly_ranking')
        .select('user_id, name, color, year, total_beers, avg_daily, days_active, position')
        .order('position', { ascending: true })

      if (typeof yearToFilter === 'number') {
        query = query.eq('year', yearToFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching ranking:', error)
        setLoading(false)
        return
      }

      const rows = (data || []) as YearlyRanking[]

      // Si es 'all', agregamos los datos de todos los años
      if (yearFilter === 'all' && rows.length > 0) {
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
        // Recalcular avg y posiciones
        aggregated.forEach((u) => {
          u.avg_daily = Number((u.total_beers / u.days_active).toFixed(2))
        })
        aggregated.sort((a, b) => b.total_beers - a.total_beers)
        aggregated.forEach((u, idx) => {
          u.position = idx + 1
        })
        setRanking(aggregated)
      } else {
        setRanking(rows)
      }

      setLoading(false)
    }

    fetchRanking()
  }, [yearFilter])

  const groupTotal = ranking.reduce((sum, u) => sum + u.total_beers, 0)
  const yearLabel = yearFilter === 'current' ? new Date().getFullYear() : yearFilter === 'all' ? 'Total' : yearFilter

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-5 h-5 text-primary" />
            Ranking {yearLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-5 h-5 text-primary" />
          Ranking {yearLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranking.map((user, idx) => (
          <div
            key={user.user_id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              user.user_id === currentUserId ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-700' : 'bg-gray-300'
              }`}
            >
              {user.position}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.total_beers} birras</p>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{user.avg_daily}/día</div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total grupo</span>
            <span className="font-bold">{groupTotal.toLocaleString()} 🍺</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
