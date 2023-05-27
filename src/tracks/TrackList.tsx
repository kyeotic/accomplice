import { useTracks, deleteTrack, updateTrack } from './db.ts'
import { Track } from './types.ts'
import ImageEditor from './ImageEditor.tsx'

export default function TrackList() {
  const tracks = useTracks()

  return (
    <div>
      {tracks.map((track: Track) => (
        <div key={track.id}>
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
          <button onClick={() => deleteTrack(track.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}
