import { BarChart3 } from 'lucide-react'
import { PlaceholderSection } from '../dashboard/PlaceholderSection'
import { SectionHeader } from '../dashboard/SectionHeader'

export const StatisticsSection: React.FC = () => (
  <div className="space-y-6">
    <SectionHeader title="Estadísticas detalladas" subtitle="Análisis profundo de tu consumo" />
    <PlaceholderSection icon={BarChart3} message="Próximamente: más estadísticas y análisis" />
  </div>
)
