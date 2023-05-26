import { useState, useCallback } from 'react'
import Dexie, { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { nanoid } from 'nanoid'

import { Track } from './types.ts'

export const UNTRACK_DB = 'untrack'
export const DB_VERSION = 1

export class UnlockDb extends Dexie {
  tracks!: Table<Track>

  constructor() {
    super(UNTRACK_DB)
    this.version(DB_VERSION).stores({
      tracks: '&id, group',
    })
  }
}

export const db = new UnlockDb()

export function useAddTrack() {
  return useCallback((track: Omit<Track, 'id'>) => {
    console.log('saving track', track)
    const newTrack = {
      ...track,
      id: nanoid(),
    }
    db.tracks
      .add(newTrack)
      .then((id: any) => console.log('added track', id))
      .catch((err) => console.error('saving track', err))
  }, [])
}

export function useTracks() {
  return useLiveQuery(() => db.tracks.toArray()) ?? []
}

// export const DbContext = createContext({})

// export function DbProvider({ children } : { children : JSX.Element }): JSX.Element {
//   const
//   useEffect(() => {
//     startDb()
//   })
// }
