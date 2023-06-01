import { A, useNavigate } from '@solidjs/router'
import { For } from 'solid-js'

import { newGroup } from './store.ts'
import { Group } from '../types.ts'

export default function GroupList(props: { groups: Group[] }) {
  const navigate = useNavigate()
  // const path = useParams()
  // const groups = useGroups()
  // const selectedGroup = () => {
  //   // console.log('check selected', unwrap(path), path.group, unwrap(groups))
  //   return props.groups.find((g) => g.name === path.group) ?? props.groups[0]
  // }

  const handleAdd = async (e: Event) => {
    e.preventDefault()

    const group = await newGroup()
    navigate(`/${group.name}?new=true`)
  }

  return (
    <>
      <div class="mb-4 text-lg font-medium text-center text-gray-500 border-b border-gray-200 font-sans">
        <ul class="flex flex-wrap -mb-px list-none items-center">
          <For each={props.groups}>
            {(g, i) => (
              <li class="mr-2">
                <A
                  href={`/${i() === 0 ? '' : g.name}`}
                  end
                  activeClass="reset inline-block p-2 border-solid text-teal-600 border-b-2 border-teal-600 rounded-t-lg active"
                  inactiveClass="reset inline-block p-2 border-solid border-b-2 border-transparent rounded-t-lg text-gray-600 hover:text-gray-400 hover:border-gray-300"
                >
                  {g.name}
                </A>
              </li>
            )}
          </For>
          <li class="mr-2">
            <span
              onClick={handleAdd}
              class="reset inline-block p-2 border-solid border-b-2 border-transparent rounded-t-lg text-gray-600 hover:text-gray-400 hover:border-gray-300 cursor-copy"
            >
              +
            </span>
          </li>
        </ul>
      </div>
    </>
  )
}
