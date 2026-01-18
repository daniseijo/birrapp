'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ComparisonsSection, OverviewSection, ProfileSection, StatisticsSection } from '@/components/sections'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { SectionId, YearFilter } from '@/lib/types'

export default function Page() {
  const [users, setUsers] = useState<Profile[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [yearFilter, setYearFilter] = useState<YearFilter>('current')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser()

      // Fetch all profiles
      const { data, error } = await supabase.from('profiles').select('*').order('name')

      if (error) {
        console.error('Error fetching users:', error)
      } else if (data && data.length > 0) {
        const profiles = data as Profile[]
        setUsers(profiles)

        // Set the authenticated user as the current user, or fallback to first profile
        if (authUser) {
          const authProfile = profiles.find((p) => p.id === authUser.id)
          if (authProfile) {
            setCurrentUserId(authProfile.id)
            setLoggedInUserId(authProfile.id)
          } else {
            // User is authenticated but doesn't have a profile yet
            setCurrentUserId(profiles[0].id)
          }
        } else {
          setCurrentUserId(profiles[0].id)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const currentUser = users.find((u) => u.id === currentUserId)

  const renderSection = (): React.ReactNode => {
    if (!currentUserId) return null

    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            userId={currentUserId}
            userName={currentUser?.name || ''}
            yearFilter={yearFilter}
            onYearChange={setYearFilter}
          />
        )
      case 'statistics':
        return <StatisticsSection />
      case 'comparisons':
        return <ComparisonsSection />
      case 'profile':
        return <ProfileSection />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUserId={currentUserId}
        loggedInUserId={loggedInUserId}
        users={users}
        onUserChange={setCurrentUserId}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header userName={currentUser?.name || ''} userColor={currentUser?.color} onOpenSidebar={() => setSidebarOpen(true)} sidebarOpen={sidebarOpen} />

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{renderSection()}</main>
      </div>

      <MobileTabBar activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}
