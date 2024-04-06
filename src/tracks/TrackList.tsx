import { createSignal, For, Show } from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'
import { last } from 'lodash'

import { useTracks } from './store.ts'
import TrackImage from './TrackImage.tsx'
import Upload from './Upload.tsx'

import './tracks.css'

export default function TrackList(props: { groupId: string }) {
  const tracks = useTracks(() => props.groupId)
  const [swappingTrackId, setSwapping] = createSignal<string | null>(null)

  function setSwap(trackId: string | null) {
    setSwapping(trackId)
  }

  return (
    <div class="m-2 flex flex-col justify-center gap-y-4">
      <Upload
        groupId={props.groupId}
        trackId={swappingTrackId() ?? undefined}
        onSubmit={() => setSwap(null)}
      />
      <TransitionGroup name="slide">
        <For each={tracks}>
          {(track) => (
            <div class="slide">
              <TrackImage
                track={track}
                isFinal={track === last(tracks)}
                setSwap={setSwap}
                isSwapping={swappingTrackId() == track.id}
              />
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
