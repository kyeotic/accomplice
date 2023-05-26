import { useTracks, deleteTrack } from './db.ts'
import { Track } from './types.ts'

export default function TrackList() {
  const tracks = useTracks()

  return (
    <div>
      {tracks.map((track: Track) => (
        <div key={track.id}>
          <img src={track.image} alt={track.id} />
          <button onClick={() => deleteTrack(track.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}
