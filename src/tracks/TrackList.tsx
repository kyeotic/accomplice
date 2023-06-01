import { useTracks } from './store.ts'
import TrackImage from './TrackImage.tsx'
import Upload from './Upload.tsx'
import { For } from 'solid-js'

export default function TrackList(props: { groupId: string }) {
  const tracks = useTracks(() => props.groupId)

  return (
    <div class="m-2">
      <Upload groupId={props.groupId} />
      <For each={tracks}>{(track) => <TrackImage track={track} />}</For>
    </div>
  )
}
