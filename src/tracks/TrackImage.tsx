import { deleteTrack, updateTrack } from './store.ts'
import { Track } from '../types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackItem(props: { track: Track }) {
  return (
    <div class="flex">
      <div class="flex-none">
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
      <div class="flex-none">
        <button onClick={() => deleteTrack(props.track.id)}>delete</button>
      </div>
    </div>
  )
}
