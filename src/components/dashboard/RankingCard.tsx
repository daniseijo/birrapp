import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'

interface RankingCardProps {
  users: User[]
  currentUserId: number
  groupTotal: number
}

export const RankingCard: React.FC<RankingCardProps> = ({ users, currentUserId, groupTotal }) => {
  const sortedUsers = [...users].sort((a, b) => a.position - b.position)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-5 h-5 text-amber-600" />
          Ranking 2025
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedUsers.map((user, idx) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              user.id === currentUserId ? 'bg-amber-50 border-2 border-amber-200' : 'bg-muted'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-300'
              }`}
            >
              {user.position}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.total} birras</p>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{user.avgDaily}/día</div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total grupo</span>
            <span className="font-bold">{groupTotal.toLocaleString()} 🍺</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
