'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { YearFilter } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface RangeDistributionCardProps {
  userId: string
  yearFilter: YearFilter
}

interface RangeData {
  label: string
  days: number
  percentage: number
  color: string
}

const RANGE_COLORS: Record<string, string> = {
  '0': '#f3f4f6',
  '1-2': '#dbeafe',
  '3-5': '#fef3c7',
  '6-9': '#fed7aa',
  '10+': '#fecaca',
}

const RANGE_ORDER = ['0', '1-2', '3-5', '6-9', '10+']

export const RangeDistributionCard: React.FC<RangeDistributionCardProps> = ({ userId, yearFilter }) => {
  const [data, setData] = useState<RangeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const supabase = createClient()

      const currentYear = new Date().getFullYear()
      const year = yearFilter === 'current' ? currentYear : yearFilter

      let query = supabase.from('user_range_distribution').select('range_label, days_count').eq('user_id', userId)

      if (typeof year === 'number') {
        query = query.eq('year', year)
      }

      const { data: rangeData, error } = await query

      if (error) {
        console.error('Error fetching range distribution:', error)
        setLoading(false)
        return
      }

      const rows = (rangeData || []) as Array<{ range_label: string; days_count: number }>

      // Aggregate data (handles 'all' years case)
      const aggregated = new Map<string, number>()
      RANGE_ORDER.forEach((label) => aggregated.set(label, 0))

      for (const row of rows) {
        const current = aggregated.get(row.range_label) || 0
        aggregated.set(row.range_label, current + Number(row.days_count))
      }

      const totalDays = Array.from(aggregated.values()).reduce((a, b) => a + b, 0)

      const result: RangeData[] = RANGE_ORDER.map((label) => {
        const days = aggregated.get(label) || 0
        return {
          label,
          days,
          percentage: totalDays > 0 ? Math.round((days / totalDays) * 100) : 0,
          color: RANGE_COLORS[label],
        }
      })

      setData(result)
      setLoading(false)
    }

    fetchData()
  }, [userId, yearFilter])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribución por rango</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-muted/20 animate-pulse mb-2" />
                <div className="h-4 bg-muted/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por rango</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {data.map((range) => (
            <div key={range.label} className="text-center">
              <div
                className="w-full aspect-square rounded-xl flex flex-col items-center justify-center mb-2"
                style={{ backgroundColor: range.color }}
              >
                <p className="text-2xl font-bold text-gray-900">{range.days}</p>
                <p className="text-xs text-gray-600 mt-1">días</p>
              </div>
              <p className="text-sm font-medium">{range.label} 🍺</p>
              <p className="text-xs text-muted-foreground">{range.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
