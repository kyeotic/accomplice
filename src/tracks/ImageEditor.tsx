import { type JSX, onMount, createSignal } from 'solid-js'
import {
  type MarkerBaseState,
  type RectangularBoxMarkerBaseState,
  type MarkerAreaState,
  MarkerArea,
  EllipseMarker,
  CoverMarker,
  FrameMarker,
  TextMarker,
} from 'markerjs2'
import { Track } from '../types'
import { updateTrack } from './store'
import { last } from 'lodash'

const MARKERS = [EllipseMarker, CoverMarker, FrameMarker, TextMarker]

export default function ImageEditor(props: { track: Track }): JSX.Element {
  // The edit and marked tracking are a combined hack
  // to reduce the flash of the unmarked image that can be seen
  // when rendering closes
  // it is caused by the editor closing while the original image is the src
  // there is no way to get the new mark until the editor has already started closing :(
  const [markedSrc, setMarked] = createSignal(
    props.track.markerImage ?? props.track.image,
  )
  const [isEditing, setEditing] = createSignal(false)
  let imageRef: HTMLImageElement | undefined
  let areaRef: MarkerArea | undefined

  async function onChange(newSrc: string, state?: string) {
    return updateTrack({
      ...props.track,
      markerImage: newSrc,
      markerState: state,
    })
  }

  onMount(() => {
    if (!imageRef || areaRef)
      throw new Error('ImageEditor did not mount correctly')

    areaRef = new MarkerArea(imageRef)
    areaRef.availableMarkerTypes = MARKERS
    areaRef.addEventListener('render', async (event) => {
      const newSrc = event.dataUrl
      setMarked(newSrc)
      setEditing(false)
      await onChange(newSrc, serializeState(event.state))
    })

    areaRef.addEventListener('close', () => {
      setEditing(false)
    })
  })

  function handleClick(e: MouseEvent) {
    const isQuickMark = e.ctrlKey

    if (isQuickMark) {
      quickMark(e)
      return
    }

    setEditing(true)
    areaRef?.show()
    if (props.track.markerState) {
      areaRef?.restoreState(deserializeState(props.track.markerState))
    }
  }

  function quickMark(e: MouseEvent) {
    if (!props.track.markerState) return
    const lastMarker: MarkerBaseState | undefined =
      last(deserializeState(props.track.markerState)?.markers) ?? undefined

    if (!isCenterable(lastMarker)) return

    const area = areaRef!
    const markerState = deserializeState(props.track.markerState)

    const newMark = {
      ...lastMarker,
      top: getOrigin(e.offsetY, lastMarker.height),
      left: getOrigin(e.offsetX, lastMarker.width),
    }

    const newState = {
      ...markerState,
      markers: [...markerState.markers, newMark],
    } as MarkerAreaState

    area.renderState(newState)
  }

  const markerImage = () => (isEditing() ? props.track.image : markedSrc())

  return (
    <img
      class="image"
      ref={imageRef}
      src={markerImage()}
      alt={props.track.id}
      onClick={handleClick}
    />
  )
}

function serializeState(state: any): string {
  return JSON.stringify(state)
}

function deserializeState(str: string): MarkerAreaState {
  return JSON.parse(str)
}

function getOrigin(centerP: number, size: number): number {
  return centerP - size / 2
}

function isCenterable(
  marker: MarkerBaseState | undefined,
): marker is RectangularBoxMarkerBaseState {
  return (
    !!marker &&
    'left' in marker &&
    'top' in marker &&
    'width' in marker &&
    'height' in marker
  )
}
