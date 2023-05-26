import Upload from './tracks/Upload.tsx'
import TrackList from './tracks/TrackList.tsx'
// import { useHydrated } from './ultra/useHydrated.ts'

export default function App() {
  // Dexie does not work in SSR environment
  // if (!useHydrated()) return <span>loading</span>
  return (
    <>
      <h1>Test</h1>
      <Upload />
      <TrackList />
    </>
  )
}
