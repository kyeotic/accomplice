import { useTracks } from './db.ts'
import { Track } from './types.ts'

export default function TrackList() {
  const tracks = useTracks()

  return (
    <div>
      {tracks.map((track: Track) => (
        <div key={track.id}>{JSON.stringify(track, null, 2)}</div>
      ))}
    </div>
  )
}
