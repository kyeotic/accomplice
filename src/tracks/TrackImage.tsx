import { Button } from '../components/mod.ts'
import { deleteTrack, moveTrack } from './store.ts'
import { Track } from '../types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackItem(props: { track: Track; isFinal?: boolean }) {
  return (
    <div class="flex justify-center mx-auto">
      <div class="flex-shrink">
        <ImageEditor track={props.track} />
      </div>
      <div class="flex-shrink bg-gray-100 flex flex-col justify-between ">
        <Button
          small
          secondary
          extraClass="rounded-tr"
          disabled={props.track.position === 0}
          onClick={() => moveTrack(props.track, props.track.position - 1)}
        >
          <i class="fa-solid fa-arrow-up" />
        </Button>
        <Button small danger onClick={() => deleteTrack(props.track.id)}>
          <i class="fa-solid fa-trash" />
        </Button>
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
