import { NAV_ITEMS } from '@/lib/data'
import { SectionId } from '@/lib/types'
import { Button } from '../ui/button'

interface MobileTabBarProps {
  activeSection: SectionId
  onSectionChange: (section: SectionId) => void
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeSection, onSectionChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-background border-t lg:hidden z-50">
    <div className="flex items-center justify-around px-2 py-3">
      {NAV_ITEMS.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onSectionChange(item.id as SectionId)}
          className={`flex flex-col items-center gap-1 px-3 py-2 h-auto rounded-xl ${
            activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  </div>
)
