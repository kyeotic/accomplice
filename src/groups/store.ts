import { Accessor } from 'solid-js'
import { db } from '../db/db'
import { useDbItem, useDbQuery } from '../db/query'
import { Group } from '../types'
import { nanoid } from 'nanoid'
import { deserializeGroup, serializeGroup } from './serializer'

export function useGroupQuery() {
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

export async function getSerializedGroup(id: string): Promise<string> {
  const group = await db.groups.get(id)
  const tracks = await db.tracks.where({ group: id }).toArray()

  if (!group) return ''

  return serializeGroup(group, tracks)
}

export async function saveSerializedGroup(serialized: string): Promise<Group> {
  const groups = await db.groups.toArray()
  const { group, tracks } = await deserializeGroup(serialized)

  group.id = nanoid()
  group.createdAt = Date.now()
  tracks.forEach((t) => {
    t.group = group.id
  })

  const originalName = group.name
  let inc = 0

  // get a unique name
  while (groups.some((g) => g.name === group.name)) {
    group.name = originalName + ` ${++inc}`
  }

  console.log('deserialized', group, tracks)

  await db.groups.put(group)
  await db.tracks.bulkPut(tracks)

  return group
}
