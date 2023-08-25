import Dexie, { Table } from 'dexie'

import { Track, Group } from '../types.ts'
import { nanoid } from 'nanoid'

export const UNTRACK_DB = 'untrack'

export class AccompliceDb extends Dexie {
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

    // use group.id
    this.version(3)
      .stores({ groupsTemp: '&id, &name', groups: null })
      .upgrade(async (transaction) => {
        const dbGroups = await transaction.table('groups').toArray()

        const newGroups = dbGroups.map((g) => ({ ...g, id: nanoid() }))

        await transaction.table('groupsTemp').bulkAdd(newGroups)
      })
    this.version(4)
      .stores({
        groups: '&id, &name',
        groupsTemp: null,
      })
      .upgrade(async (transaction) => {
        const dbGroups = await transaction.table('groupsTemp').toArray()
        await transaction.table('groups').bulkAdd(dbGroups)
      })
    // Store tracks with group.id
    this.version(5)
      .stores({ groups: '&id, &name' })
      .upgrade(async (transaction) => {
        const dbTracks = await transaction.table('tracks').toArray()
        const dbGroups = await transaction.table('groups').toArray()
        const tracks = dbTracks.map((t) => ({
          ...t,
          group: dbGroups.find((g) => g.name === t.group).id,
        }))
        await transaction.table('tracks').bulkPut(tracks)
      })
  }
}

export const db = new AccompliceDb()

// Initial group
db.on('populate', () => {
  db.groups.add({ id: nanoid(), name: 'default', createdAt: Date.now() })
})
