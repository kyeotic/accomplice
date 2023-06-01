import { useState, useCallback, useRef, FormEvent, useEffect } from 'react'
import { useNavigate, useQueryParams } from 'raviger'
import useKey from '@reecelucas/react-use-hotkeys'

import { updateGroup, deleteGroup } from './store.ts'
import TrackList from '../tracks/TrackList.tsx'
import { Group } from '../types.ts'

export default function GroupEdit({
  group,
  canDelete = false,
}: {
  group: Group
  canDelete: boolean
}) {
  return (
    <div className="p-2">
      <GroupForm group={group} canDelete={canDelete} />
      <TrackList group={group.name} />
    </div>
  )
}

function GroupForm({
  group,
  canDelete = false,
}: {
  group: Group
  canDelete: boolean
}) {
  const navigate = useNavigate()
  const [{ new: isNew }, setQuery] = useQueryParams()
  const [name, setName] = useState(group.name)
  const nameRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      await updateGroup({ ...group, name })
      navigate(`/${name}`, { replace: true })
    },
    [name, group, navigate]
  )

  useEffect(() => {
    setName(group.name)
  }, [group])

  useEffect(() => {
    if (!isNew) return
    setQuery({}, {})
    // This is needed because the page change resets the select after focus
    setTimeout(() => nameRef.current?.select(), 1)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew])

  useKey(
    'Escape',
    () => {
      setName(group.name)
    },
    { ignoredElementWhitelist: ['INPUT'] }
  )

  const handleDelete = useCallback(async () => {
    console.log('delete group', group)
    deleteGroup(group.id)
    navigate('/')
  }, [navigate, group])

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex items-center border-solid border-b border-teal-500 py-2 mb-2">
        <input
          ref={nameRef}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          value={name}
          onFocus={selectOnFocus}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        {canDelete && (
          <button
            className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
            type="button"
            onClick={handleDelete}
          >
            Delete Group ❌
          </button>
        )}
      </div>
    </form>
  )
}

function selectOnFocus(e: any) {
  e.target.select()
}
