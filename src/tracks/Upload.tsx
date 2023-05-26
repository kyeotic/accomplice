import { addTrack } from './db.ts'

export default function Upload() {
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
