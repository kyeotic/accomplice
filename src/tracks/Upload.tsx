import { useAddTrack } from './db.ts'

export default function Upload() {
  const addTrack = useAddTrack()

  return (
    <div>
      <button onClick={() => addTrack}>Add Track</button>
    </div>
  )
}
