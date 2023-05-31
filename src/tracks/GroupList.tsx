import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react'
import { usePath, Link, useNavigate } from 'raviger'
import useKey from '@reecelucas/react-use-hotkeys'

import { useGroups, addGroup } from './db.ts'
import { Group } from './types.ts'
import TrackList from './TrackList.tsx'

// bg-slate-600

export default function GroupList() {
  const path = (usePath() ?? '/').substring(1)
  const groups = useGroups()
  const selectedGroup = groups.find((g) => g.name === path) ?? groups[0]

  // console.log('groups', path, groups, selectedGroup)

  return (
    <>
      <div className="text-lg font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px list-none">
          {groups.map((g, i) => (
            <li key={g.name} className="mr-2">
              {g === selectedGroup ? (
                <Link
                  href={`/${i === 0 ? '' : g.name}`}
                  className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active"
                >
                  {g.name}
                </Link>
              ) : (
                <Link
                  href={`/${i === 0 ? '' : g.name}`}
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  {g.name}
                </Link>
              )}
            </li>
          ))}
          <li className="mr-2">
            <AddGroup />
          </li>
        </ul>
      </div>
      {selectedGroup && <TrackList group={selectedGroup.name} />}
    </>
  )
}

function AddGroup() {
  const navigate = useNavigate()
  const [isEditing, setEditing] = useState(false)
  const [newName, setName] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const edit = useCallback(() => {
    setEditing(true)
    inputRef.current?.focus()
  }, [inputRef])

  // whenever isEditing gets set to true, focus the textbox
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing, inputRef])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      await addGroup(newName)

      navigate(`/${newName}`)
      setEditing(false)
      setName('')
    },
    [newName]
  )

  useKey(
    'Escape',
    () => {
      console.log('ESC KEY')
      setEditing(false)
    },
    { ignoredElementWhitelist: ['INPUT'] }
  )

  if (!isEditing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
      >
        New Collection
      </span>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
    >
      <input
        value={newName}
        ref={inputRef}
        placeholder="(New Collection name)"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
    </form>
  )
}
