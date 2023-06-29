import { Routes, Route } from '@solidjs/router'

// import { useHydrated } from './ultra/useHydrated.ts'

import GroupPage from './groups/GroupPage.tsx'
import RematchDynamic from './components/DynamicRoute.tsx'
import GuidePage from './guide/GuidePage.tsx'
import Footer from './nav/Footer.tsx'
import NavBar from './nav/NavBar.tsx'
import { GroupProvider } from './groups/context.tsx'

export default function App() {
  // Dexie does not work in SSR environment
  // if (!useHydrated()) return <span>loading</span>
  return (
    <GroupProvider>
      <div class="flex flex-col justify-between min-h-screen">
        <div class="flex-none">
          <NavBar />
        </div>
        <div class="flex-auto">
          <Routes>
            <Route path="/" component={GroupPage} />
            <Route path="/guide" component={GuidePage} />
            <Route
              path=":group?"
              element={<RematchDynamic key="group" component={GroupPage} />}
            />
          </Routes>
        </div>
        <div class="flex-none">
          <Footer />
        </div>
      </div>
    </GroupProvider>
  )
}
