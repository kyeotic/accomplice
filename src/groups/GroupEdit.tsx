import { createSignal, createEffect, Show, mergeProps } from 'solid-js'
import { useNavigate, useSearchParams } from '@solidjs/router'

import { updateGroup, deleteGroup } from './store.ts'
import TrackList from '../tracks/TrackList.tsx'
import { Group } from '../types.ts'
import { Button } from '../components/mod.ts'

export default function GroupEdit(props: { group: Group; canDelete: boolean }) {
  return (
    <Show when={props.group}>
      <>
        <TrackList groupId={props.group.id} />
        <GroupForm group={props.group} canDelete={props.canDelete} />
      </>
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

    const newName = name()
    await updateGroup({ ...props.group, name: newName })
    console.log('navigating')
    // Wait for the live query to reset before trying to navigate
    // otherwise it wont be found and we will get 404ed
    setTimeout(() => {
      navigate(`/${newName}`, { replace: true })
      console.log('navigated', newName)
    }, 1)
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
    <form
      onSubmit={handleSubmit}
      class=" flex justify-center bg-white shadow-md rounded pb-2 mb-2"
    >
      <div class="">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="groupName"
        >
          Group Name
        </label>

        <input
          ref={nameRef}
          id="groupName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={name()}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={resetName}
        />
      </div>
      <Show when={merged.canDelete}>
        <div class="mt-7 mb-1 mx-4">
          <Button extraClass="text-sm rounded" danger onClick={handleDelete}>
            Delete Group ❌
          </Button>
        </div>
      </Show>
    </form>
  )
}
