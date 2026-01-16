import { User, YearFilter } from '@/lib/types'
import { SectionHeader } from '../dashboard/SectionHeader'
import { EvolutionChart } from '../dashboard/EvolutionChart'
import { RangeDistributionCard } from '../dashboard/RangeDistributionCard'
import { RANGE_DATA } from '@/lib/data'
import { StreakCard } from '../dashboard/StreakCard'
import { Award, Beer, Calendar, TrendingUp } from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import { RankingCard } from '../dashboard/RankingCard'
import { YearComparisonCard } from '../dashboard/YearComparisonCard'

interface OverviewSectionProps {
  currentUser: User
  users: User[]
  groupTotal: number
  userPercentage: string
  yearFilter: YearFilter
  onYearChange: (year: YearFilter) => void
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  currentUser,
  users,
  groupTotal,
  userPercentage,
  yearFilter,
  onYearChange,
}) => (
  <div>
    <SectionHeader title={`Hola, ${currentUser.name} 👋`} yearFilter={yearFilter} onYearChange={onYearChange} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <EvolutionChart currentUserId={currentUser.id} yearFilter={yearFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RangeDistributionCard data={RANGE_DATA} />
          <YearComparisonCard userId={currentUser.id} yearFilter={yearFilter} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakCard
            title="Racha bebiendo"
            value={currentUser.maxStreak}
            subtitle="días consecutivos"
            icon={TrendingUp}
            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"
          />
          <StreakCard
            title="Racha sin beber"
            value={currentUser.noStreakMax}
            subtitle="días consecutivos"
            icon={Calendar}
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
          />
        </div>
      </div>

      {/* Right column (1/3) */}
      <div className="space-y-6">
        <div className="space-y-4">
          <StatCard
            title="Total del año"
            value={currentUser.total.toLocaleString()}
            subtitle="cervezas bebidas"
            icon={Beer}
            highlight
            position={currentUser.position}
          />
          <StatCard title="Media diaria" value={currentUser.avgDaily} subtitle="cervezas por día" icon={TrendingUp} />
          <StatCard
            title="Días activos"
            value={currentUser.daysActive}
            subtitle={`${((currentUser.daysActive / 365) * 100).toFixed(1)}% del año`}
            icon={Calendar}
          />
          <StatCard
            title="Posición"
            value={`#${currentUser.position}`}
            subtitle={`${userPercentage}% del grupo`}
            icon={Award}
          />
        </div>

        <RankingCard users={users} currentUserId={currentUser.id} groupTotal={groupTotal} />
      </div>
    </div>
  </div>
)
