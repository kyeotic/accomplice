import { onMount, onCleanup } from 'solid-js'
import { addTrack, updateTrackImage } from './store.ts'

export default function Upload(props: {
  groupId: string
  trackId?: string
  onSubmit: () => void
}) {
  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    console.log('paste', props.groupId, e.clipboardData?.files[0])

    const file = e.clipboardData?.files[0]

    if (file?.type !== 'image/png') return

    const reader = new FileReader()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      const image = event.target.result
      if (props.trackId) {
        updateTrackImage(props.trackId, image)
      } else {
        addTrack({
          group: props.groupId,
          image,
        })
      }
      props.onSubmit()
      reader.removeEventListener('load', handler)
    }

    reader.addEventListener('load', handler)

    reader.readAsDataURL(file)
  }

  onMount(() => document.addEventListener('paste', handlePaste))
  onCleanup(() => document.removeEventListener('paste', handlePaste))

  return null
}
