import { useParams } from '@solidjs/router'
import { Component, JSX, Show } from 'solid-js'

export default function RematchDynamic(props: {
  component: Component
  key: string
}): JSX.Element {
  const params = useParams()

  return <Show keyed when={params[props.key] ?? ''}>
    {props.component({})}
  </Show>
}
