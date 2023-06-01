import { useCallback, type FormEvent } from 'react'
import { usePath, Link, useNavigate } from 'raviger'

import { useGroups, newGroup } from './store.ts'
import GroupEdit from './GroupEdit.tsx'

export default function GroupList() {
  const navigate = useNavigate()
  const path = (usePath() ?? '/').substring(1)
  const groups = useGroups()
  const selectedGroup = groups.find((g) => g.name === path) ?? groups[0]

  const handleAdd = useCallback(
    async (e: FormEvent<HTMLElement>) => {
      e.preventDefault()

      const group = await newGroup()
      navigate(`/${group.name}?new=true`)
    },
    [navigate]
  )

  return (
    <>
      <div className="mb-4 text-lg font-medium text-center text-gray-500 border-b border-gray-200 font-sans">
        <ul className="flex flex-wrap -mb-px list-none items-center">
          {groups.map((g, i) => (
            <li key={g.name} className="mr-2">
              {g === selectedGroup ? (
                <Link
                  href={`/${i === 0 ? '' : g.name}`}
                  className="reset inline-block p-2 border-solid text-teal-600 border-b-2 border-teal-600 rounded-t-lg active"
                >
                  {g.name}
                </Link>
              ) : (
                <Link
                  href={`/${i === 0 ? '' : g.name}`}
                  className="reset inline-block p-2 border-solid border-b-2 border-transparent rounded-t-lg text-gray-600 hover:text-gray-400 hover:border-gray-300"
                >
                  {g.name}
                </Link>
              )}
            </li>
          ))}
          <li className="mr-2">
            <span
              onClick={handleAdd}
              className="reset inline-block p-2 border-solid border-b-2 border-transparent rounded-t-lg text-gray-600 hover:text-gray-400 hover:border-gray-300 cursor-copy"
            >
              +
            </span>
          </li>
        </ul>
      </div>
      {selectedGroup && (
        <GroupEdit group={selectedGroup} canDelete={groups.length > 1} />
      )}
    </>
  )
}
