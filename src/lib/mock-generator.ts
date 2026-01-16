import { USERS } from './data'
import { DayEntry, YearFilter } from './types'

const USER_PATTERNS = {
  1: { avgBeers: 3.0, zeroProb: 0.2, highDayProb: 0.1, longStreakProb: 0.05 },
  2: { avgBeers: 3.4, zeroProb: 0.15, highDayProb: 0.12, longStreakProb: 0.04 },
  3: { avgBeers: 3.3, zeroProb: 0.18, highDayProb: 0.11, longStreakProb: 0.06 },
  4: { avgBeers: 2.7, zeroProb: 0.22, highDayProb: 0.08, longStreakProb: 0.07 },
  5: { avgBeers: 1.2, zeroProb: 0.4, highDayProb: 0.03, longStreakProb: 0.12 },
}

function generateBeerCount(pattern: (typeof USER_PATTERNS)[1], isWeekend: boolean): number {
  const rand = Math.random()
  if (rand < pattern.zeroProb) return 0
  if (rand < pattern.zeroProb + pattern.highDayProb) {
    return Math.floor(Math.random() * 5) + 10
  }
  const weekendBonus = isWeekend ? 2 : 0
  const base = pattern.avgBeers + weekendBonus
  const variation = Math.floor(Math.random() * 4) - 2
  return Math.max(0, Math.round(base + variation))
}

function generateYearData(userId: number, year: number, upToDate?: Date): DayEntry[] {
  const pattern = USER_PATTERNS[userId as keyof typeof USER_PATTERNS]
  const data: DayEntry[] = []
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const daysInYear = isLeapYear ? 366 : 365

  let zeroStreakStart: number | null = null
  let zeroStreakLength = 0

  for (let i = 0; i < daysInYear; i++) {
    const currentDate = new Date(year, 0, i + 1)
    if (upToDate && currentDate > upToDate) break

    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (zeroStreakStart === null && Math.random() < pattern.longStreakProb) {
      zeroStreakStart = i
      zeroStreakLength = Math.floor(Math.random() * 5) + 3
    }

    const inZeroStreak = zeroStreakStart !== null && i - zeroStreakStart < zeroStreakLength
    if (zeroStreakStart !== null && i - zeroStreakStart >= zeroStreakLength) {
      zeroStreakStart = null
    }

    const beers = inZeroStreak ? 0 : generateBeerCount(pattern, isWeekend)
    try {
      data.push({ date: currentDate.toISOString().split('T')[0], beers })
    } catch (error) {
      console.error({ year, day: i })
      throw new Error(`Error generating date for user ${userId} on ${currentDate}: ${error}`)
    }
  }

  return data
}

function getUserDataByYear(userId: number, year: YearFilter): DayEntry[] {
  const currentDate = new Date(2026, 0, 15)

  if (year === 'all') {
    return [
      ...generateYearData(userId, 2023),
      ...generateYearData(userId, 2024),
      ...generateYearData(userId, 2025),
      ...generateYearData(userId, 2026, currentDate),
    ]
  }

  if (year === 'current') {
    return generateYearData(userId, 2026, currentDate)
  }

  return year === 2026 ? generateYearData(userId, year, currentDate) : generateYearData(userId, year)
}

export function getAllUsersDataByYear(year: YearFilter): Record<number, DayEntry[]> {
  const result: Record<number, DayEntry[]> = {}
  USERS.forEach((user) => {
    result[user.id] = getUserDataByYear(user.id, year)
  })
  return result
}
