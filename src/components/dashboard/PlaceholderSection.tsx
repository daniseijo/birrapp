import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface PlaceholderSectionProps {
  icon: LucideIcon
  message: string
}

export const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ icon: Icon, message }) => (
  <Card>
    <CardContent className="p-12 text-center">
      <Icon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
)
