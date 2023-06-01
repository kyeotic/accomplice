import Dexie, { Table } from 'dexie'

import { Track, Group } from '../types.ts'
import { nanoid } from 'nanoid'

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
  }
}

export const db = new UnlockDb()

// Initial group
db.on('populate', () => {
  db.groups.add({ id: nanoid(), name: 'default', createdAt: Date.now() })
})
