import { useState } from 'react'
import useEvent from '@react-hook/event'
import { addTrack } from './db.ts'

export default function Upload() {
  const [image, setImage] = useState(null)
  useEvent(document, 'paste', (e: ClipboardEvent) => {
    e.preventDefault()
    // console.log('paste', e.clipboardData?.files[0])

    const file = e.clipboardData?.files[0]

    if (file?.type !== 'image/png') return

    const reader = new FileReader()

    const handler = (event: any) => {
      setImage(event.target.result)
      addTrack({
        group: 'default',
        image: event.target.result,
        marks: [],
      })
      reader.removeEventListener('load', handler)
    }

    reader.addEventListener('load', handler)

    reader.readAsDataURL(file)
  })

  return null

  // return (
  //   <div className="m-2">
  //     <button
  //       onClick={() =>
  //         addTrack({
  //           group: 'default',
  //           image: 'test',
  //           marks: [],
  //         })
  //       }
  //     >
  //       Add Track
  //     </button>
  //     {image && <img src={image} />}
  //   </div>
  // )
}

function encode(imageStream: string): string {
  return imageStream
}
