import { createContext, useContext, type ParentProps, type JSX } from 'solid-js'
import { useGroupQuery } from './store.ts'

function useGroupProvider() {
  const groups = useGroupQuery()
  return {
    groups,
  }
}

export type GroupContextType = ReturnType<typeof useGroupProvider>

const GroupContext = createContext<GroupContextType>()

export function GroupProvider(props: ParentProps): JSX.Element {
  const ctx = useGroupProvider()
  return (
    <GroupContext.Provider value={ctx}>{props.children}</GroupContext.Provider>
  )
}

export function useGroups() {
  const context = useContext(GroupContext)
  if (context === undefined) {
    throw new Error(`useGroups must be used within a GroupProvider`)
  }
  return context
}
