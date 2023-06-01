import { useNavigate, useParams } from '@solidjs/router'
import { useGroups } from './store.ts'
import GroupList from './GroupList.tsx'
import GroupEdit from './GroupEdit.tsx'
import { createEffect } from 'solid-js'

export default function GroupPage() {
  const navigate = useNavigate()
  const path = useParams()
  const groups = useGroups()
  const selectedGroup = () => {
    return groups.find((g) => g.name === path.group) ?? groups[0]
  }

  createEffect(() => {
    if (!path.group) return
    if (selectedGroup()?.name !== path.group) {
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
