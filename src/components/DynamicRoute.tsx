import { Params, useParams } from '@solidjs/router'
import { Component, JSX, createEffect, createSignal, on } from 'solid-js'

export default function RematchDynamic(props: {
  component: Component
  on?: (params: Params) => any
}): JSX.Element {
  const params = useParams()
  const [page, setPage] = createSignal<JSX.Element>(props.component({}))

  const paramSignal = () =>
    props.on ? props.on(params) : Object.values(params)

  createEffect(
    on(paramSignal, () => {
      setPage(() => props.component({}))
    })
  )

  // @ts-ignore
  return page
}
