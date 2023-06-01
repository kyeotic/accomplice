import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../db/db'
import { Group } from '../types'
import { nanoid } from 'nanoid'

export function useGroups(): Group[] {
  return useLiveQuery(() => db.groups.toCollection().sortBy('createdAt')) ?? []
}

export async function newGroup() {
  const id = nanoid()
  const group = { id, name: id, createdAt: Date.now() }
  await db.groups.add(group)
  return group
}

export async function updateGroup(group: Group) {
  await db.groups.put(group)
  return group
}

export async function deleteGroup(id: string) {
  const group = await db.groups.get(id)
  if (!group) return
  await db.transaction('readwrite', db.tracks, db.groups, async () => {
    await db.tracks.where({ group: group.name }).delete()
    await db.groups.delete(id)
  })
  return
}
