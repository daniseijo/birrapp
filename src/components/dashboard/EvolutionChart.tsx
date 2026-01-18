'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { YearFilter } from '@/lib/types'
import { Button } from '../ui/button'

type Granularity = 'day' | 'week' | 'month'

interface EvolutionChartProps {
  userId: string
  yearFilter: YearFilter
}

interface ChartDataPoint {
  date: string
  [key: string]: number | string
}

const getDateKey = (dateStr: string, gran: Granularity): string => {
  if (gran === 'day') return dateStr

  const date = new Date(dateStr)

  if (gran === 'week') {
    // Get ISO week
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
    const week1 = new Date(d.getFullYear(), 0, 4)
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    return `${date.getFullYear()}-S${String(weekNum).padStart(2, '0')}`
  }

  // Month
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ userId, yearFilter }) => {
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [visibleLines, setVisibleLines] = useState<Set<string>>(new Set([userId, 'average']))
  const [prevUserId, setPrevUserId] = useState(userId)
  const [users, setUsers] = useState<Profile[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  // Update visible lines when userId changes (using pattern to avoid setState in effect)
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    const newSet = new Set(visibleLines)
    // Remove all user IDs except the new one
    users.forEach((u) => {
      if (u.id !== userId) newSet.delete(u.id)
    })
    // Add the new userId
    newSet.add(userId)
    setVisibleLines(newSet)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const supabase = createClient()

      // Fetch users
      const { data: profilesData } = await supabase.from('profiles').select('*').order('name')
      const profiles = (profilesData || []) as Profile[]
      setUsers(profiles)

      // Fetch beer entries with pagination
      const currentYear = new Date().getFullYear()
      const year = yearFilter === 'current' ? currentYear : yearFilter

      const allEntries: Array<{ user_id: string; date: string; beers: number }> = []
      const pageSize = 1000
      let offset = 0
      let hasMore = true

      while (hasMore) {
        let query = supabase
          .from('beer_entries')
          .select('user_id, date, beers')
          .order('date')
          .range(offset, offset + pageSize - 1)

        if (typeof year === 'number') {
          query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
        }

        const { data: entriesData } = await query
        const batch = (entriesData || []) as Array<{ user_id: string; date: string; beers: number }>

        allEntries.push(...batch)

        if (batch.length < pageSize) {
          hasMore = false
        } else {
          offset += pageSize
        }
      }

      const entries = allEntries

      // Group by period (day/week/month) and user
      const periodMap = new Map<string, Map<string, number>>()

      for (const entry of entries) {
        const periodKey = getDateKey(entry.date, granularity)

        if (!periodMap.has(periodKey)) {
          periodMap.set(periodKey, new Map())
        }
        const userMap = periodMap.get(periodKey)!
        userMap.set(entry.user_id, (userMap.get(entry.user_id) || 0) + entry.beers)
      }

      // Sort periods and build chart data
      const sortedPeriods = Array.from(periodMap.keys()).sort()

      const data: ChartDataPoint[] = sortedPeriods.map((period) => {
        const periodData = periodMap.get(period)!
        const point: ChartDataPoint = { date: period }

        // Daily consumption per user
        profiles.forEach((user) => {
          point[user.id] = periodData.get(user.id) || 0
        })

        // Calculate average across users for this period
        const values = profiles.map((u) => (periodData.get(u.id) || 0) as number)
        point.average =
          values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0

        return point
      })

      setChartData(data)
      setLoading(false)
    }

    fetchData()
  }, [yearFilter, granularity])

  const toggleLine = (lineId: string) => {
    const newVisible = new Set(visibleLines)
    if (newVisible.has(lineId)) {
      newVisible.delete(lineId)
    } else {
      newVisible.add(lineId)
    }
    setVisibleLines(newVisible)
  }

  const granularityOptions = [
    { value: 'day' as Granularity, label: 'Día' },
    { value: 'week' as Granularity, label: 'Semana' },
    { value: 'month' as Granularity, label: 'Mes' },
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución temporal</CardTitle>
          <CardDescription>Consumo de cervezas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted/20 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Evolución temporal</CardTitle>
              <CardDescription>Consumo de cervezas</CardDescription>
            </div>
            {/* Granularity selector */}
            <div className="flex gap-2">
              {granularityOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={granularity === option.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setGranularity(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Line toggles */}
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => toggleLine(user.id)}
                className={`gap-2 ${visibleLines.has(user.id) ? 'shadow-sm' : 'opacity-50'}`}
                style={visibleLines.has(user.id) ? { borderColor: user.color } : {}}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                <span className="font-medium">{user.name}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleLine('average')}
              className={`gap-2 ${visibleLines.has('average') ? 'border-gray-400 shadow-sm' : 'opacity-50'}`}
            >
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="font-medium">Media</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          {granularity === 'month' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              {users.map(
                (user) =>
                  visibleLines.has(user.id) && (
                    <Bar key={user.id} dataKey={user.id} fill={user.color} name={user.name} radius={[4, 4, 0, 0]} />
                  ),
              )}
              {visibleLines.has('average') && (
                <Bar dataKey="average" fill="#9CA3AF" name="Media" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : granularity === 'day' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fontSize: 11 }}
                interval={Math.max(0, Math.floor(chartData.length / 12))}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              {users.map(
                (user) =>
                  visibleLines.has(user.id) && (
                    <Area
                      key={user.id}
                      type="monotone"
                      dataKey={user.id}
                      stroke={user.color}
                      fill={user.color}
                      fillOpacity={0.1}
                      strokeWidth={1.5}
                      isAnimationActive={false}
                      name={user.name}
                    />
                  ),
              )}
              {visibleLines.has('average') && (
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#9CA3AF"
                  fill="#9CA3AF"
                  fillOpacity={0.05}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  isAnimationActive={false}
                  name="Media"
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fontSize: 11 }}
                interval={Math.max(0, Math.floor(chartData.length / 8))}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              {users.map(
                (user) =>
                  visibleLines.has(user.id) && (
                    <Line
                      key={user.id}
                      type="monotone"
                      dataKey={user.id}
                      stroke={user.color}
                      strokeWidth={2}
                      dot={{ fill: user.color, r: 3 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={false}
                      name={user.name}
                    />
                  ),
              )}
              {visibleLines.has('average') && (
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#9CA3AF', r: 3 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  name="Media"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
