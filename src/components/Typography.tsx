import { type ParentProps } from 'solid-js'

export function Title(props: ParentProps) {
  return <span class="text-lg font-bold py-4 block">{props.children}</span>
}

export function Body(props: ParentProps) {
  return <span class="py-2 block">{props.children}</span>
}
