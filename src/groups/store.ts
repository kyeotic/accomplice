import { Accessor } from 'solid-js'
import { db } from '../db/db'
import { useDbItem, useDbQuery } from '../db/query'
import { Group } from '../types'
import { nanoid } from 'nanoid'

export function useGroups() {
  return useDbQuery(() => db.groups.toCollection().sortBy('createdAt'))
}

export function useGroup(name: Accessor<string>) {
  return useDbItem(async () => {
    const group = await db.groups.where({ name: name() }).first()
    if (group) return group
    const groups = await db.groups.toCollection().sortBy('createdAt')
    return groups[0]
  })
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
