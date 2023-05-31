import Dexie, { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { nanoid } from 'nanoid'
import { maxBy } from 'lodash'

import { Track, Group } from './types.ts'

export const UNTRACK_DB = 'untrack'

export class UnlockDb extends Dexie {
  tracks!: Table<Track>
  groups!: Table<Group>

  constructor() {
    super(UNTRACK_DB)
    this.version(2)
      .stores({ tracks: '&id, group, position', groups: '&name' })
      .upgrade(async (transaction) => {
        let position = 0
        await transaction
          .table('tracks')
          .toCollection()
          .modify((track) => {
            track.position = position++
          })

        await transaction
          .table('groups')
          .put({ name: 'default', createdAt: Date.now() })
      })
  }
}

export const db = new UnlockDb()

// Initial group
db.on('populate', () => {
  db.groups.add({ name: 'default', createdAt: Date.now() })
})

export function useGroups(): Group[] {
  return useLiveQuery(() => db.groups.toCollection().sortBy('createdAt')) ?? []
}

export async function addGroup(name: string) {
  return await db.groups.add({ name, createdAt: Date.now() })
}

export function useTracks(group: string): Track[] {
  return (
    useLiveQuery(
      () => db.tracks.where({ group }).sortBy('position'),
      [group]
    ) ?? []
  )
}

export async function addTrack(track: Omit<Track, 'id' | 'position'>) {
  return await db.transaction('readwrite', db.tracks, async (tx) => {
    const group = await db.tracks.where({ group: track.group }).toArray()
    const maxPosition = group.length
      ? maxBy(group, (g: Track) => g.position).position + 1
      : 0
    const newTrack = {
      ...track,
      id: nanoid(),
      position: maxPosition,
    }
    console.log('saving track', newTrack)
    try {
      const id = await db.tracks.add(newTrack)
      console.log('added track', id)
    } catch (e: unknown) {
      console.error('saving track', e)
    }
  })
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
