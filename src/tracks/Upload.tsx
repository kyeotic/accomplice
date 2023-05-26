import { useAddTrack } from './db.ts'

export default function Upload() {
  const addTrack = useAddTrack()

  return (
    <div className="m-2">
      <button
        onClick={() =>
          addTrack({
            group: 'default',
            image: 'test',
            marks: [],
          })
        }
      >
        Add Track
      </button>
    </div>
  )
}
