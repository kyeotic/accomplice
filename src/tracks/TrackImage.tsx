import classNames from 'classnames'

import { Button } from '../components/mod.ts'
import { deleteTrack, moveTrack } from './store.ts'
import { Track } from '../types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackImage(props: {
  track: Track
  isFinal?: boolean
  setSwap: (trackId: string | null) => void
  isSwapping: boolean
}) {
  return (
    <div class="flex justify-center mx-auto">
      <div class="flex-shrink">
        <ImageEditor track={props.track} />
      </div>
      <div class="flex-shrink bg-gray-600 flex flex-col justify-between ">
        <Button
          small
          secondary
          extraClass="rounded-tr"
          disabled={props.track.position === 0}
          onClick={() => moveTrack(props.track, props.track.position - 1)}
        >
          <i class="fa-solid fa-arrow-up" />
        </Button>
        <div class="flex flex-col gap-1">
          <Button
            small
            onClick={() =>
              props.setSwap(props.isSwapping ? null : props.track.id)
            }
          >
            <i
              class={classNames('fa-solid fa-arrow-right-arrow-left', {
                'fa-beat': props.isSwapping,
              })}
            />
          </Button>
          <Button small danger onClick={() => deleteTrack(props.track.id)}>
            <i class="fa-solid fa-trash" />
          </Button>
        </div>
        <Button
          small
          secondary
          extraClass="rounded-br"
          disabled={props.isFinal}
          onClick={() => moveTrack(props.track, props.track.position + 1)}
        >
          <i class="fa-solid fa-arrow-down" />
        </Button>
      </div>
    </div>
  )
}
