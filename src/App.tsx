import { Routes, Route } from '@solidjs/router'
import GroupList from './groups/GroupList.tsx'
import GroupEdit from './groups/GroupEdit.tsx'

// import { useHydrated } from './ultra/useHydrated.ts'

import './tracks/styles.css'

export default function App() {
  // Dexie does not work in SSR environment
  // if (!useHydrated()) return <span>loading</span>
  return (
    <>
      <GroupList />
      <Routes>
        <Route path="/" component={GroupEdit} />
        <Route path="/:group" component={GroupEdit} />
      </Routes>
    </>
  )
}
