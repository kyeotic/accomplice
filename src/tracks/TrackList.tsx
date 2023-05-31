import { useTracks } from './db.ts'
import { Track } from './types.ts'
import TrackImage from './TrackImage.tsx'
import Upload from './Upload.tsx'

export default function TrackList({ group = 'default' }: { group: string }) {
  const tracks = useTracks(group)

  return (
    <div className="m-2">
      <Upload group={group} />
      {tracks.map((track: Track) => (
        <TrackImage key={track.id} track={track} />
      ))}
    </div>
  )
}
