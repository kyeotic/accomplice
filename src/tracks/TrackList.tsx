import { For } from 'solid-js'
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
    </div>
  )
}
