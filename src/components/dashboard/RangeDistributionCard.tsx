import { RangeData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface RangeDistributionCardProps {
  data: RangeData[]
}

export const RangeDistributionCard: React.FC<RangeDistributionCardProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Distribución por rango</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((range) => (
          <div key={range.name} className="text-center">
            <div
              className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center mb-2"
              style={{ backgroundColor: range.color }}
            >
              <p className="text-3xl font-bold text-gray-900">{range.value}</p>
              <p className="text-xs text-gray-600 mt-1">días</p>
            </div>
            <p className="text-sm font-medium">{range.name}</p>
            <p className="text-xs text-muted-foreground">{range.percentage}%</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)
