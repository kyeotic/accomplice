import { Button } from '../components/mod.ts'
import { deleteTrack, updateTrack, moveTrack } from './store.ts'
import { Track } from '../types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackItem(props: { track: Track; isFinal?: boolean }) {
  return (
    <div class="flex justify-center max-w-full gap-y-2 mb-4">
      <div class="flex-shrink bg-gray-100">
        <div class="flex h-[30px] justify-between ">
          <Button
            small
            secondary
            extraClass="rounded-tl"
            disabled={props.track.position === 0}
            onClick={() => moveTrack(props.track, props.track.position - 1)}
          >
            ←
          </Button>
          <Button small danger onClick={() => deleteTrack(props.track.id)}>
            Delete
          </Button>
          <Button
            small
            secondary
            extraClass="rounded-tr"
            disabled={props.isFinal}
            onClick={() => moveTrack(props.track, props.track.position + 1)}
          >
            →
          </Button>
        </div>
        <ImageEditor
          src={props.track.image}
          alt={props.track.id}
          onChange={(newSrc: string) =>
            updateTrack({
              ...props.track,
              image: newSrc,
            })
          }
        />
      </div>
    </div>
  )
}
