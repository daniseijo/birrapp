import { User } from 'lucide-react'
import { PlaceholderSection } from '../dashboard/PlaceholderSection'
import { SectionHeader } from '../dashboard/SectionHeader'

export const ProfileSection: React.FC = () => (
  <div className="space-y-6">
    <SectionHeader title="Perfil" subtitle="Configuración y preferencias" />
    <PlaceholderSection icon={User} message="Próximamente: ajustes de perfil" />
  </div>
)
