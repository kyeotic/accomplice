import { useNavigate, useParams } from '@solidjs/router'
import { useGroups } from './store.ts'
import GroupList from './GroupList.tsx'
import GroupEdit from './GroupEdit.tsx'
import { createEffect, createMemo } from 'solid-js'

export default function GroupPage() {
  const navigate = useNavigate()
  const path = useParams()
  const groups = useGroups()
  const groupName = createMemo(() => decodeURIComponent(path.group))
  const selectedGroup = () => {
    return groups.find((g) => g.name === groupName()) ?? groups[0]
  }

  createEffect(() => {
    if (!path.group) return
    if (groups.length && selectedGroup()?.name !== groupName()) {
      navigate('/')
    }
  })

  return (
    <>
      <GroupList groups={groups} />
      <GroupEdit group={selectedGroup()} canDelete={groups.length > 1} />
    </>
  )
}
