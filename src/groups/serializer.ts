import pako from 'pako'
import { bytesToBase64, base64ToBytes } from 'byte-base64'

import { Group, Track } from '../types'

export function serializeGroup(group: Group, tracks: Track[]): string {
  return bytesToBase64(pako.deflate(JSON.stringify({ group, tracks })))
}

export function deserializeGroup(serialized: string): {
  group: Group
  tracks: Track[]
} {
  const decompressed = JSON.parse(
    pako.inflate(base64ToBytes(serialized), { to: 'string' }),
  )

  if ('group' in decompressed && 'tracks' in decompressed)
    return decompressed as { group: Group; tracks: Track[] }

  console.error('invalid group', decompressed)
  throw new Error('Invalid serialized group')
}
