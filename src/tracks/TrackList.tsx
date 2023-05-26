import { useTracks } from './db.ts'

export default function TrackList() {
  const tracks = useTracks()

  console.log('tracks', tracks)

  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id}>{JSON.stringify(track, null, 2)}</div>
      ))}
    </div>
  )
}
