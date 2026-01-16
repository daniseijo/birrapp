import { YearFilter } from '@/lib/types'
import { InlineDropdown } from './InlineDropdown'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  yearFilter?: YearFilter
  onYearChange?: (year: YearFilter) => void
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, yearFilter, onYearChange }) => {
  const yearOptions = [
    { value: 'current', label: '2026' },
    { value: 'all', label: 'histórico' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
  ]

  const needsDe = yearFilter !== 'all'

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      {yearFilter && onYearChange ? (
        <p className="text-muted-foreground text-xl">
          Este es tu resumen {needsDe && 'de '}
          <InlineDropdown
            value={String(yearFilter)}
            options={yearOptions}
            onChange={(value) => onYearChange(value as YearFilter)}
          />
        </p>
      ) : subtitle ? (
        <p className="text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  )
}
