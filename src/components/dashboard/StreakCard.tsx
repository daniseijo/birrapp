import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface StreakCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  className: string
  maxDots?: number
}

export const StreakCard: React.FC<StreakCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  maxDots = 20,
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{title}</h3>
        <div className={className}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: Math.min(value, maxDots) }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-6 rounded-full"
            style={{ backgroundColor: className.includes('green') ? '#4ade80' : '#60a5fa' }}
          />
        ))}
        {value > maxDots && <span className="text-xs text-muted-foreground ml-1 self-center">+{value - maxDots}</span>}
      </div>
    </CardContent>
  </Card>
)
