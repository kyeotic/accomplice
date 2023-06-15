import { createSignal, Show, type JSX, type ParentProps } from 'solid-js'
import Button from './Button'

import copy from 'copy-to-clipboard'

export default function ClipboardButton(
  props: { getText: () => Promise<string> } & ParentProps<
    JSX.ButtonHTMLAttributes<HTMLButtonElement>
  >,
): JSX.Element {
  const [hasCopied, setCopied] = createSignal<boolean>(false)

  async function handleCopy(e: Event) {
    e.preventDefault()
    const text = await props.getText()
    copy(text, { format: 'text/plain' })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button extraClass="text-sm rounded" onClick={handleCopy}>
      <Show when={hasCopied()}>
        <span>Copied to Clipboard!</span>
      </Show>
      <Show when={!hasCopied()}>{props.children}</Show>
    </Button>
  )
}
