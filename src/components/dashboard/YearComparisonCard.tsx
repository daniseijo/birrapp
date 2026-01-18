'use client'

import { useEffect, useState } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { YearFilter } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface YearComparisonCardProps {
  userId: string
  yearFilter: YearFilter
}

interface ComparisonData {
  todayBeers: number
  lastYearBeers: number
  difference: number
  ytdCurrentYear: number
  ytdLastYear: number
  ytdDifference: number
  ytdPercentage: string
  daysUp: number
  daysEqual: number
  daysDown: number
  year: number
  previousYear: number
}

export const YearComparisonCard: React.FC<YearComparisonCardProps> = ({ userId, yearFilter }) => {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true)
      const supabase = createClient()

      const currentYear = new Date().getFullYear()
      const year = typeof yearFilter === 'number' ? yearFilter : currentYear
      const previousYear = year - 1

      const today = new Date()
      const month = today.getMonth()
      const day = today.getDate()

      // Format dates for queries
      const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const lastYearStr = `${previousYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

      // Query current year data
      const { data: currentYearData } = await supabase
        .from('beer_entries')
        .select('date, beers')
        .eq('user_id', userId)
        .gte('date', `${year}-01-01`)
        .lte('date', todayStr)
        .order('date')

      // Query previous year data (same period)
      const { data: previousYearData } = await supabase
        .from('beer_entries')
        .select('date, beers')
        .eq('user_id', userId)
        .gte('date', `${previousYear}-01-01`)
        .lte('date', lastYearStr)
        .order('date')

      const currentEntries = (currentYearData || []) as Array<{ date: string; beers: number }>
      const previousEntries = (previousYearData || []) as Array<{ date: string; beers: number }>

      // Today vs same day last year
      const todayEntry = currentEntries.find((e) => e.date === todayStr)
      const lastYearEntry = previousEntries.find((e) => e.date === lastYearStr)

      const todayBeers = todayEntry?.beers || 0
      const lastYearBeers = lastYearEntry?.beers || 0
      const difference = todayBeers - lastYearBeers

      // Year-to-date totals
      const ytdCurrentYear = currentEntries.reduce((sum, e) => sum + e.beers, 0)
      const ytdLastYear = previousEntries.reduce((sum, e) => sum + e.beers, 0)
      const ytdDifference = ytdCurrentYear - ytdLastYear
      const ytdPercentage = ytdLastYear > 0 ? ((ytdDifference / ytdLastYear) * 100).toFixed(1) : '0'

      // Days comparison (by matching dates)
      let daysUp = 0
      let daysEqual = 0
      let daysDown = 0

      // Create a map of previous year entries by month-day
      const prevYearMap = new Map<string, number>()
      for (const entry of previousEntries) {
        const monthDay = entry.date.slice(5) // Get MM-DD part
        prevYearMap.set(monthDay, entry.beers)
      }

      // Compare each current year entry with the same day last year
      for (const entry of currentEntries) {
        const monthDay = entry.date.slice(5)
        const prevBeers = prevYearMap.get(monthDay)
        if (prevBeers !== undefined) {
          if (entry.beers > prevBeers) daysUp++
          else if (entry.beers < prevBeers) daysDown++
          else daysEqual++
        }
      }

      setData({
        todayBeers,
        lastYearBeers,
        difference,
        ytdCurrentYear,
        ytdLastYear,
        ytdDifference,
        ytdPercentage,
        daysUp,
        daysEqual,
        daysDown,
        year,
        previousYear,
      })
      setLoading(false)
    }

    fetchComparison()
  }, [userId, yearFilter])

  const getColor = (diff: number) => {
    if (diff > 0) return 'text-primary'
    if (diff < 0) return 'text-blue-600'
    return 'text-muted-foreground'
  }

  const getBgColor = (diff: number) => {
    if (diff > 0) return 'bg-primary/10 border-primary/20'
    if (diff < 0) return 'bg-blue-50 border-blue-200'
    return 'bg-muted/50 border-border'
  }

  const renderIcon = (diff: number, className: string) => {
    if (diff > 0) return <TrendingUp className={className} />
    if (diff < 0) return <TrendingDown className={className} />
    return <Minus className={className} />
  }

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparativa interanual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
          <div className="h-24 bg-muted/20 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comparativa interanual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today vs Last Year */}
        <div className={`p-4 rounded-lg border-2 ${getBgColor(data.difference)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mismo día {data.previousYear}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{data.todayBeers}</span>
                <span className="text-sm text-muted-foreground">vs {data.lastYearBeers}</span>
              </div>
            </div>
            <div className={`flex flex-col items-center ${getColor(data.difference)}`}>
              {renderIcon(data.difference, 'h-8 w-8')}
              <span className="text-lg font-semibold mt-1">
                {data.difference > 0 ? '+' : ''}
                {data.difference}
              </span>
            </div>
          </div>
        </div>

        {/* Year to Date Comparison */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total año hasta hoy</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{data.ytdCurrentYear.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {data.previousYear}: {data.ytdLastYear.toLocaleString()}
              </div>
            </div>
            <div className={`flex items-center gap-2 ${getColor(data.ytdDifference)}`}>
              {renderIcon(data.ytdDifference, 'h-5 w-5')}
              <div className="text-right">
                <div className="font-semibold">
                  {data.ytdDifference > 0 ? '+' : ''}
                  {data.ytdDifference}
                </div>
                <div className="text-sm">
                  ({data.ytdDifference > 0 ? '+' : ''}
                  {data.ytdPercentage}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días ↑</div>
            <div className="text-lg font-semibold text-primary">{data.daysUp}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días =</div>
            <div className="text-lg font-semibold text-muted-foreground">{data.daysEqual}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días ↓</div>
            <div className="text-lg font-semibold text-blue-600">{data.daysDown}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
