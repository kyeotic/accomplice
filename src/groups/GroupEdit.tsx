import { createSignal, createEffect, Show, mergeProps } from 'solid-js'
import { useNavigate, useSearchParams } from '@solidjs/router'

import { updateGroup, deleteGroup } from './store.ts'
import TrackList from '../tracks/TrackList.tsx'
import { Group } from '../types.ts'

export default function GroupEdit(props: { group: Group; canDelete: boolean }) {
  return (
    <Show when={props.group}>
      <div class="p-2">
        <GroupForm group={props.group} canDelete={props.canDelete} />
        <TrackList groupId={props.group.id} />
      </div>
    </Show>
  )
}

function GroupForm(props: { group: Group; canDelete: boolean }) {
  const merged = mergeProps({ canDelete: false }, props)
  const navigate = useNavigate()
  const [query, setQuery] = useSearchParams()
  const [name, setName] = createSignal('')
  let nameRef: HTMLInputElement | undefined

  createEffect(() => {
    setName(props.group.name)
  })

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    await updateGroup({ ...props.group, name: name() })
    navigate(`/${name()}`, { replace: true })
  }

  // If we are coming in from group create we want to rename
  createEffect(() => {
    if (!query.new) return
    setQuery({ new: null })
    // This is needed because the page change resets the select after focus
    setTimeout(() => nameRef?.select(), 1)
  })

  function resetName(e: KeyboardEvent) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return
    // must blur first or the value will be blocked
    nameRef?.blur()
    setName(props.group.name)
  }

  const handleDelete = async () => {
    // console.log('delete group', props.group)
    deleteGroup(props.group.id)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} class="w-full max-w-sm">
      <div class="flex items-center border-solid border-b border-teal-500 py-2 mb-2">
        <input
          ref={nameRef}
          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          value={name()}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={resetName}
        />
        <Show when={merged.canDelete}>
          <button
            class="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
            type="button"
            onClick={handleDelete}
          >
            Delete Group ❌
          </button>
        </Show>
      </div>
    </form>
  )
}
