import { For, Show } from 'solid-js'
import { last } from 'lodash'
import { useTracks } from './store.ts'
import TrackImage from './TrackImage.tsx'
import Upload from './Upload.tsx'

export default function TrackList(props: { groupId: string }) {
  const tracks = useTracks(() => props.groupId)

  return (
    <div class="m-2 mt-6">
      <Upload groupId={props.groupId} />
      <For each={tracks}>
        {(track) => (
          <TrackImage track={track} isFinal={track === last(tracks)} />
        )}
      </For>
      <Show when={tracks.length === 0}>
        <span class="block text-3xl font-bold w-full text-center mb-12">
          No images. Paste an image to start tracking.
        </span>
      </Show>
    </div>
  )
}
