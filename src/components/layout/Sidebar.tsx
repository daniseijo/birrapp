import { NAV_ITEMS } from '@/lib/data'
import { SectionId, User } from '@/lib/types'
import { Beer, PanelLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
  users: User[]
  onUserChange: (user: User) => void
  activeSection: SectionId
  onSectionChange: (section: SectionId) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onUserChange,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-50 hidden lg:block ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Beer className="w-7 h-7 text-primary" />
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">Birrapp</span>
          </h1>
          <Button variant="ghost" size="icon" onClick={onClose} title="Hide sidebar">
            <PanelLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6 space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Usuario</Label>
          <Select
            value={currentUser.id.toString()}
            onValueChange={(value) => {
              const user = users.find((u) => u.id === parseInt(value))
              if (user) onUserChange(user)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona usuario" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id as SectionId)}
              className={`w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
