import { USERS } from './data'
import { DayEntry } from './types'

export type Granularity = 'day' | 'week' | 'month'

interface DailyData {
  date: string
  day: number
  [key: string]: number | string // For dynamic user keys like 'user_1', 'user_2', etc.
}

export const convertToChartData = (yearData: Record<number, DayEntry[]>): DailyData[] => {
  const allDates = new Set<string>()
  Object.values(yearData).forEach((entries) => {
    entries.forEach((entry) => allDates.add(entry.date))
  })

  const sortedDates = Array.from(allDates).sort()

  return sortedDates.map((date, index) => {
    const point: DailyData = {
      date: date.split('-').slice(1).join('/'), // Format as DD/MM
      day: index + 1,
    }
    USERS.forEach((user) => {
      const userEntry = yearData[user.id]?.find((e) => e.date === date)
      point[`user_${user.id}`] = userEntry?.beers || 0
    })
    return point
  })
}

export const aggregateData = (dailyData: DailyData[], granularity: Granularity): DailyData[] => {
  if (granularity === 'day') return dailyData

  const aggregated: DailyData[] = []
  const chunkSize = granularity === 'week' ? 7 : 30

  for (let i = 0; i < dailyData.length; i += chunkSize) {
    const chunk = dailyData.slice(i, i + chunkSize)
    const aggregatedPoint: DailyData = {
      date: granularity === 'week' ? `S${Math.floor(i / 7) + 1}` : `M${Math.floor(i / 30) + 1}`,
      day: i + 1,
    }

    USERS.forEach((user) => {
      const key = `user_${user.id}`
      aggregatedPoint[key] = chunk.reduce((sum, day) => sum + (day[key] as number), 0)
    })

    aggregated.push(aggregatedPoint)
  }

  return aggregated
}

export const calculateAverage = (data: DailyData[]): DailyData[] => {
  return data.map((point) => {
    const sum = USERS.reduce((acc, user) => acc + (point[`user_${user.id}`] as number), 0)
    return { ...point, average: sum / USERS.length }
  })
}
