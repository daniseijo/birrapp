'use client'

import { Header } from '@/components/layout/Header'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ComparisonsSection, OverviewSection, ProfileSection, StatisticsSection } from '@/components/sections'
import { USERS } from '@/lib/data'
import { SectionId, User, YearFilter } from '@/lib/types'
import { useState } from 'react'

export default function Page() {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0])
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [yearFilter, setYearFilter] = useState<YearFilter>('current')

  const groupTotal = USERS.reduce((sum, u) => sum + u.total, 0)
  const userPercentage = ((currentUser.total / groupTotal) * 100).toFixed(1)

  const renderSection = (): React.ReactNode => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            currentUser={currentUser}
            users={USERS}
            groupTotal={groupTotal}
            userPercentage={userPercentage}
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

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        users={USERS}
        onUserChange={setCurrentUser}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header currentUser={currentUser} onOpenSidebar={() => setSidebarOpen(true)} sidebarOpen={sidebarOpen} />

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{renderSection()}</main>
      </div>

      <MobileTabBar activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}
