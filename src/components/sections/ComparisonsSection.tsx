import { Users } from 'lucide-react'
import { PlaceholderSection } from '../dashboard/PlaceholderSection'
import { SectionHeader } from '../dashboard/SectionHeader'

export const ComparisonsSection: React.FC = () => (
  <div className="space-y-6">
    <SectionHeader title="Comparativas" subtitle="Compara con años anteriores y el grupo" />
    <PlaceholderSection icon={Users} message="Próximamente: comparativas año anterior y más" />
  </div>
)
