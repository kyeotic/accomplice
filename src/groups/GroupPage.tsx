import { useNavigate, useParams } from '@solidjs/router'
import GroupEdit from './GroupEdit.tsx'
import { createEffect, createMemo } from 'solid-js'
import { useGroups } from './context.tsx'

export default function GroupPage() {
  const navigate = useNavigate()
  const path = useParams()
  const { groups } = useGroups()
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

  return <GroupEdit group={selectedGroup()} canDelete={groups.length > 1} />
}
