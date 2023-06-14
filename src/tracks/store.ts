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
    console.log('saving track', newTrack.id)
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

export async function moveTrack(track: Track, targetPosition: number) {
  // console.log('test move', targetPosition)
  // return
  if (track.position === targetPosition) return
  if (!Number.isInteger(targetPosition) || targetPosition < 0)
    throw new Error('targetPosition must be an integer >= 0')
  return await db.transaction('readwrite', db.tracks, async () => {
    const dbTracks = await db.tracks.where({ group: track.group }).toArray()

    // find all the tracks between the current position and the target
    const isDecreasing = targetPosition < track.position
    const tracksToMove = isDecreasing
      ? dbTracks.filter(
          (t) => t.position >= targetPosition && t.position < track.position
        )
      : dbTracks.filter(
          (t) => t.position <= targetPosition && t.position > track.position
        )

    await db.tracks.bulkPut([
      // if target is decreasing everything else shifts up
      // if target is increasing everything else shifts down
      ...tracksToMove.map((t) => ({
        ...t,
        position: isDecreasing ? t.position + 1 : t.position - 1,
      })),
      { ...track, position: targetPosition },
    ])
  })
}
