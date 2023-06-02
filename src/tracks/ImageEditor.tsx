import { type JSX, onMount, createSignal, createEffect } from 'solid-js'
import {
  MarkerArea,
  EllipseMarker,
  CoverMarker,
  FrameMarker,
  type MarkerAreaState,
} from 'markerjs2'
import { Track } from '../types'
import { updateTrack } from './store'

export default function ImageEditor(props: { track: Track }): JSX.Element {
  // The edit and marked tracking are a combined hack
  // to reduce the flash of the unmarked image that can be seen
  // when rendering closes
  // it is caused by the editor closing while the original image is the src
  // there is no way to get the new mark until the editor has already started closing :(
  const [markedSrc, setMarked] = createSignal(
    props.track.markerImage ?? props.track.image
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
    areaRef.availableMarkerTypes = [EllipseMarker, CoverMarker, FrameMarker]
    areaRef.addEventListener('render', async (event) => {
      const newSrc = event.dataUrl
      setMarked(newSrc)
      setEditing(false)
      await onChange(newSrc, serializeState(event.state))
    })
  })

  function handleShow() {
    setEditing(true)
    areaRef?.show()
    if (props.track.markerState) {
      areaRef?.restoreState(deserializeState(props.track.markerState))
    }
  }

  const markerImage = () => (isEditing() ? props.track.image : markedSrc())

  return (
    <img
      class="image"
      ref={imageRef}
      src={markerImage()}
      alt={props.track.id}
      onClick={handleShow}
    />
  )
}

function serializeState(state: any): string {
  return JSON.stringify(state)
}

function deserializeState(str: string): MarkerAreaState {
  return JSON.parse(str)
}
