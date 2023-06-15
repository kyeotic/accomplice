import { liveQuery, type PromiseExtended } from 'dexie'
import {
  from,
  Accessor,
  createMemo,
  createEffect,
  on,
  onCleanup,
} from 'solid-js'
import { createStore, reconcile, SetStoreFunction } from 'solid-js/store'

type ReconcileOptions = Parameters<typeof reconcile>[1]
type NotArray<T> = T extends unknown[] ? never : T

export function useDbItem<T>(
  querier: () => NotArray<T> | PromiseExtended<NotArray<T>>,
): Accessor<T | undefined> {
  const get = createMemo(() => from(liveQuery(querier)))
  // eslint-disable-next-line solid/reactivity
  return () => get()()
}

export function useDbQuery<T>(querier: () => T[] | Promise<T[]>): T[] {
  const [store, setStore] = createStore<T[]>([])

  createEffect(
    on(querier, () => {
      fromReconcileStore<T[]>(liveQuery(querier), store, setStore)
    }),
  )

  return store
}

function fromReconcileStore<T>(
  producer: {
    subscribe: (
      fn: (v: T) => void,
    ) => (() => void) | { unsubscribe: () => void }
  },
  store: T,
  setStore: SetStoreFunction<T>,
  options: ReconcileOptions = { key: 'id' },
): T {
  const unsub = producer.subscribe((v) => setStore(reconcile(v, options)))
  onCleanup(() => ('unsubscribe' in unsub ? unsub.unsubscribe() : unsub()))
  return store
}
