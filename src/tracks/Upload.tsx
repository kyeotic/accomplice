import useEvent from '@react-hook/event'
import { addTrack } from './store.ts'

export default function Upload({ group }: { group: string }) {
  useEvent(document, 'paste', (e: ClipboardEvent) => {
    e.preventDefault()
    console.log('paste', group, e.clipboardData?.files[0])

    const file = e.clipboardData?.files[0]

    if (file?.type !== 'image/png') return

    const reader = new FileReader()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      addTrack({
        group,
        image: event.target.result,
      })
      reader.removeEventListener('load', handler)
    }

    reader.addEventListener('load', handler)

    reader.readAsDataURL(file)
  })

  return null
}
