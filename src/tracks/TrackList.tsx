import { For, Show } from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'
import { last } from 'lodash'

import { useTracks } from './store.ts'
import TrackImage from './TrackImage.tsx'
import Upload from './Upload.tsx'

import './tracks.css'

export default function TrackList(props: { groupId: string }) {
  const tracks = useTracks(() => props.groupId)

  return (
    <div class="m-2 flex flex-col justify-center gap-y-4">
      <Upload groupId={props.groupId} />
      <TransitionGroup name="group-item">
        <For each={tracks}>
          {(track) => (
            <div class="group-item">
              <TrackImage track={track} isFinal={track === last(tracks)} />
            </div>
          )}
        </For>
      </TransitionGroup>
      <Show when={tracks.length === 0}>
        <span class="block text-3xl font-bold w-full text-center mb-12">
          No images. Paste an image to start tracking.
        </span>
      </Show>
    </div>
  )
}
