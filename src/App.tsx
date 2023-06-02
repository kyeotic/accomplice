import { Routes, Route } from '@solidjs/router'

// import { useHydrated } from './ultra/useHydrated.ts'

import GroupPage from './groups/GroupPage.tsx'

export default function App() {
  // Dexie does not work in SSR environment
  // if (!useHydrated()) return <span>loading</span>
  return (
    <>
      <Routes>
        <Route path="/:group?" component={GroupPage} />
      </Routes>
    </>
  )
}
