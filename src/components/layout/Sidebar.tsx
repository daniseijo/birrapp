import { NAV_ITEMS } from '@/lib/data'
import { SectionId, User } from '@/lib/types'
import { Beer, PanelLeft, Pin, PinOff } from 'lucide-react'

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
            <Beer className="w-7 h-7 text-amber-500" />
            <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Birrapp</span>
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Hide sidebar">
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Usuario
          </label>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const user = users.find((u) => u.id === parseInt(e.target.value))
              if (user) onUserChange(user)
            }}
            className="w-full p-3 bg-muted rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id as SectionId)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-amber-50 text-amber-700 font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
