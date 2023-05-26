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

export function useTracks() {
  return useLiveQuery(() => db.tracks.toArray()) ?? []
}

export async function addTrack(track: Omit<Track, 'id'>) {
  console.log('saving track', track)
  const newTrack = {
    ...track,
    id: nanoid(),
  }
  try {
    const id = await db.tracks.add(newTrack)
    console.log('added track', id)
  } catch (e: unknown) {
    console.error('saving track', e)
  }
}

export async function updateTrack(track: Track) {
  await db.tracks.put(track)
  return track
}

export async function deleteTrack(id: string) {
  return await db.tracks.delete(id)
}

// export const DbContext = createContext({})

// export function DbProvider({ children } : { children : JSX.Element }): JSX.Element {
//   const
//   useEffect(() => {
//     startDb()
//   })
// }
