import GroupList from './tracks/GroupList.tsx'
// import { useHydrated } from './ultra/useHydrated.ts'

import './tracks/styles.css'

export default function App() {
  // Dexie does not work in SSR environment
  // if (!useHydrated()) return <span>loading</span>
  return (
    <>
      <GroupList />
    </>
  )
}
