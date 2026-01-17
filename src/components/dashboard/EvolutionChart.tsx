import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useState } from 'react'
import { aggregateData, calculateAverage, convertToChartData, Granularity } from '@/lib/charts'
import { USERS } from '@/lib/data'
import { getAllUsersDataByYear } from '@/lib/mock-generator'
import { YearFilter } from '@/lib/types'
import { Button } from '../ui/button'

interface EvolutionChartProps {
  currentUserId: number
  yearFilter: YearFilter
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ currentUserId, yearFilter }) => {
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [visibleLines, setVisibleLines] = useState<Set<string>>(new Set([`user_${currentUserId}`, 'average']))

  const yearData = getAllUsersDataByYear(yearFilter)
  const dailyData = convertToChartData(yearData)
  const aggregatedData = aggregateData(dailyData, granularity)
  const chartData = calculateAverage(aggregatedData)

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

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Evolución temporal</CardTitle>
              <CardDescription>Consumo acumulado de cervezas</CardDescription>
            </div>
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

          {/* Line toggles */}
          <div className="flex flex-wrap gap-2">
            {USERS.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => toggleLine(`user_${user.id}`)}
                className={`gap-2 ${
                  visibleLines.has(`user_${user.id}`) ? 'shadow-sm' : 'opacity-50'
                }`}
                style={visibleLines.has(`user_${user.id}`) ? { borderColor: user.color } : {}}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                <span className="font-medium">{user.name}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleLine('average')}
              className={`gap-2 ${
                visibleLines.has('average') ? 'border-gray-400 shadow-sm' : 'opacity-50'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="font-medium">Media</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
              interval={Math.floor(chartData.length / 12)}
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
            {USERS.map(
              (user) =>
                visibleLines.has(`user_${user.id}`) && (
                  <Line
                    key={user.id}
                    type="monotone"
                    dataKey={`user_${user.id}`}
                    stroke={user.color}
                    strokeWidth={currentUserId === user.id ? 3 : 2}
                    dot={false}
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
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
                name="Media"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
