import { YearFilter } from '@/lib/types'
import { SectionHeader } from '../dashboard/SectionHeader'
import { EvolutionChart } from '../dashboard/EvolutionChart'
import { RangeDistributionCard } from '../dashboard/RangeDistributionCard'
import { RankingCard } from '../dashboard/RankingCard'
import { YearComparisonCard } from '../dashboard/YearComparisonCard'
import { UserStatsCards } from '../dashboard/UserStatsCards'
import { UserStreakCards } from '../dashboard/UserStreakCards'

interface OverviewSectionProps {
  userId: string
  userName: string
  yearFilter: YearFilter
  onYearChange: (year: YearFilter) => void
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ userId, userName, yearFilter, onYearChange }) => (
  <div>
    <SectionHeader title={`Hola ${userName} 👋`} yearFilter={yearFilter} onYearChange={onYearChange} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <EvolutionChart userId={userId} yearFilter={yearFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RangeDistributionCard userId={userId} yearFilter={yearFilter} />
          <YearComparisonCard userId={userId} yearFilter={yearFilter} />
        </div>

        <UserStreakCards userId={userId} yearFilter={yearFilter} />
      </div>

      {/* Right column (1/3) */}
      <div className="space-y-6">
        <UserStatsCards userId={userId} yearFilter={yearFilter} />
        <RankingCard yearFilter={yearFilter} />
      </div>
    </div>
  </div>
)
