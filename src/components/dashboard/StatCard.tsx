import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  highlight?: boolean
  position?: number
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, highlight, position }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {highlight && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Top {position}</span>
        )}
      </div>
      <h3 className="text-xs font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </CardContent>
  </Card>
)
