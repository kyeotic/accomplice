import { onMount, onCleanup } from 'solid-js'
import { addTrack } from './store.ts'

export default function Upload({ groupId }: { groupId: string }) {
  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    console.log('paste', groupId, e.clipboardData?.files[0])

    const file = e.clipboardData?.files[0]

    if (file?.type !== 'image/png') return

    const reader = new FileReader()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      addTrack({
        group: groupId,
        image: event.target.result,
      })
      reader.removeEventListener('load', handler)
    }

    reader.addEventListener('load', handler)

    reader.readAsDataURL(file)
  }

  onMount(() => document.addEventListener('paste', handlePaste))
  onCleanup(() => document.removeEventListener('paste', handlePaste))

  return null
}
