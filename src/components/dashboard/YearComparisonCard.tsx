import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { getAllUsersDataByYear } from '@/lib/mock-generator'
import { useEffect, useState } from 'react'
import { YearFilter } from '@/lib/types'

interface YearComparisonCardProps {
  userId: number
  yearFilter: YearFilter
}

export const YearComparisonCard: React.FC<YearComparisonCardProps> = ({ userId, yearFilter }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get the current year dynamically
  const currentYear = new Date().getFullYear()

  // Convert yearFilter to a number (use current year if it's 'current' or 'all')
  const year = typeof yearFilter === 'number' ? yearFilter : currentYear
  const previousYear = year - 1

  // Get today's date
  const today = new Date()
  const month = today.getMonth()
  const day = today.getDate()

  // Get data for current and previous year
  const currentYearData = getAllUsersDataByYear(year as YearFilter)[userId] || []
  const previousYearData = getAllUsersDataByYear(previousYear as YearFilter)[userId] || []

  // Find the same day in both years
  const todayStr = new Date(year, month, day).toISOString().split('T')[0]
  const lastYearStr = new Date(previousYear, month, day).toISOString().split('T')[0]

  const todayEntry = currentYearData.find((e) => e.date === todayStr)
  const lastYearEntry = previousYearData.find((e) => e.date === lastYearStr)

  const todayBeers = todayEntry?.beers || 0
  const lastYearBeers = lastYearEntry?.beers || 0
  const difference = todayBeers - lastYearBeers

  // Calculate year-to-date comparison
  const ytdCurrentYear = currentYearData.reduce((sum, e) => sum + e.beers, 0)
  const ytdLastYear = previousYearData
    .filter((e) => {
      const entryDate = new Date(e.date)
      return entryDate.getMonth() < month || (entryDate.getMonth() === month && entryDate.getDate() <= day)
    })
    .reduce((sum, e) => sum + e.beers, 0)

  const ytdDifference = ytdCurrentYear - ytdLastYear
  const ytdPercentage = ytdLastYear > 0 ? ((ytdDifference / ytdLastYear) * 100).toFixed(1) : '0'

  const getIcon = (diff: number) => {
    if (diff > 0) return TrendingUp
    if (diff < 0) return TrendingDown
    return Minus
  }

  const getColor = (diff: number) => {
    if (diff > 0) return 'text-amber-600'
    if (diff < 0) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getBgColor = (diff: number) => {
    if (diff > 0) return 'bg-amber-50 border-amber-200'
    if (diff < 0) return 'bg-blue-50 border-blue-200'
    return 'bg-gray-50 border-gray-200'
  }

  const Icon = getIcon(difference)
  const YtdIcon = getIcon(ytdDifference)

  // Show loading state until client-side hydration is complete
  if (!isClient) {
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
        <div className={`p-4 rounded-lg border-2 ${getBgColor(difference)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mismo día {previousYear}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{todayBeers}</span>
                <span className="text-sm text-muted-foreground">vs {lastYearBeers}</span>
              </div>
            </div>
            <div className={`flex flex-col items-center ${getColor(difference)}`}>
              <Icon className="h-8 w-8" />
              <span className="text-lg font-semibold mt-1">
                {difference > 0 ? '+' : ''}
                {difference}
              </span>
            </div>
          </div>
        </div>

        {/* Year to Date Comparison */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total año hasta hoy</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{ytdCurrentYear.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {previousYear}: {ytdLastYear.toLocaleString()}
              </div>
            </div>
            <div className={`flex items-center gap-2 ${getColor(ytdDifference)}`}>
              <YtdIcon className="h-5 w-5" />
              <div className="text-right">
                <div className="font-semibold">
                  {ytdDifference > 0 ? '+' : ''}
                  {ytdDifference}
                </div>
                <div className="text-sm">
                  ({ytdDifference > 0 ? '+' : ''}
                  {ytdPercentage}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días ↑</div>
            <div className="text-lg font-semibold text-amber-600">
              {
                currentYearData.filter((entry, index) => {
                  const prevEntry = previousYearData[index]
                  return prevEntry && entry.beers > prevEntry.beers
                }).length
              }
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días =</div>
            <div className="text-lg font-semibold text-gray-600">
              {
                currentYearData.filter((entry, index) => {
                  const prevEntry = previousYearData[index]
                  return prevEntry && entry.beers === prevEntry.beers
                }).length
              }
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Días ↓</div>
            <div className="text-lg font-semibold text-blue-600">
              {
                currentYearData.filter((entry, index) => {
                  const prevEntry = previousYearData[index]
                  return prevEntry && entry.beers < prevEntry.beers
                }).length
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
