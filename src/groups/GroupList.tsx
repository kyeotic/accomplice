import { A, useNavigate } from '@solidjs/router'
import { For } from 'solid-js'

import { newGroup, saveSerializedGroup } from './store.ts'
import { useGroups } from './context.tsx'

const ACTIVE =
  'reset inline-block p-2 border-solid text-teal-600 border-b-2 border-teal-600 rounded-t-lg active'
const INACTIVE =
  'reset inline-block p-2 border-solid border-b-2 border-transparent rounded-t-lg text-gray-600 hover:text-gray-400 hover:border-gray-300'

export default function GroupList() {
  const navigate = useNavigate()
  const { groups } = useGroups()

  async function handleAdd(e: Event) {
    e.preventDefault()

    const group = await newGroup()
    navigate(`/${group.name}?new=true`)
  }

  async function handleImport(e: Event) {
    e.preventDefault()

    const input = prompt('Paste the Group to import')

    if (!input) return

    const group = await saveSerializedGroup(input)

    navigate(`/${group.name}`)
  }

  return (
    <>
      <div class="mb-2 px-8 text-lg font-medium text-center text-gray-500 border-b border-gray-200 font-sans shadow-2xl">
        <ul class="flex flex-wrap -mb-px list-none items-center">
          <For each={groups}>
            {(g, i) => (
              <li class="mr-2">
                <A
                  href={`/${i() === 0 ? '' : encodeURIComponent(g.name)}`}
                  end
                  activeClass={ACTIVE}
                  inactiveClass={INACTIVE}
                >
                  {g.name}
                </A>
              </li>
            )}
          </For>
          <li class="mr-2">
            <span onClick={handleAdd} class={`${INACTIVE} cursor-copy`}>
              +
            </span>
          </li>
          <li class="mr-2">
            <i
              class={`${INACTIVE} fa-solid fa-file-import cursor-pointer`}
              onClick={handleImport}
            />
          </li>
        </ul>
      </div>
    </>
  )
}
