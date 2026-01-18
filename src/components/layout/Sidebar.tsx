'use client'

import { useRouter } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/data'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { SectionId } from '@/lib/types'
import { Beer, LogOut, PanelLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: string | null
  loggedInUserId: string | null
  users: Profile[]
  onUserChange: (userId: string) => void
  activeSection: SectionId
  onSectionChange: (section: SectionId) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUserId,
  loggedInUserId,
  users,
  onUserChange,
  activeSection,
  onSectionChange,
}) => {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const loggedInUser = users.find((u) => u.id === loggedInUserId)

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
            value={currentUserId || ''}
            onValueChange={(value) => onUserChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona usuario" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
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

        {loggedInUser && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: loggedInUser.color }}
              >
                {loggedInUser.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{loggedInUser.name}</p>
                <p className="text-xs text-muted-foreground">Conectado</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
