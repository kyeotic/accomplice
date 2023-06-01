import { nanoid } from 'nanoid'
import { maxBy } from 'lodash'

import { db } from '../db/db'
import { useDbQuery } from '../db/query'
import { Track } from '../types'
import { Accessor } from 'solid-js'

export function useTracks(group: Accessor<string>) {
  return useDbQuery(async () =>
    db.tracks.where({ group: group() }).sortBy('position')
  )
}

export async function addTrack(track: Omit<Track, 'id' | 'position'>) {
  return await db.transaction('readwrite', db.tracks, async () => {
    const group = await db.tracks.where({ group: track.group }).toArray()
    const maxPosition = group.length
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        maxBy(group, (g: Track) => g.position)!.position + 1
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
