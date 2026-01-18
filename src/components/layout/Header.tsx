import { PanelLeft } from 'lucide-react'
import { Button } from '../ui/button'

interface HeaderProps {
  userName: string
  userColor?: string
  onOpenSidebar: () => void
  sidebarOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({ userName, userColor = '#6366f1', onOpenSidebar, sidebarOpen }) => (
  <header className="bg-background border-b sticky top-0 z-40">
    <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
      {!sidebarOpen && (
        <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="hidden lg:flex" title="Show sidebar">
          <PanelLeft className="w-5 h-5" />
        </Button>
      )}
      <div className={`flex items-center gap-3 ${sidebarOpen ? 'ml-auto' : 'lg:ml-auto'}`}>
        {userName && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: userColor }}
            >
              {userName[0]}
            </div>
          </>
        )}
      </div>
    </div>
  </header>
)
