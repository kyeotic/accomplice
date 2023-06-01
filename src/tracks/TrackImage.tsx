import { deleteTrack, updateTrack } from './store.ts'
import { Track } from '../types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackItem({ track }: { track: Track }) {
  return (
    <div className="flex">
      <div className="flex-none">
        <ImageEditor
          src={track.image}
          alt={track.id}
          onChange={(newSrc: string) =>
            updateTrack({
              ...track,
              image: newSrc,
            })
          }
        />
      </div>
      <div className="flex-none">
        <button onClick={() => deleteTrack(track.id)}>delete</button>
      </div>
    </div>
  )
}
