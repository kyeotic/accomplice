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
import { last } from 'lodash'
import hotkeys from 'hotkeys-js'

import { Track } from '../types'
import { updateTrack } from './store'

const MARKERS = [EllipseMarker, CoverMarker, FrameMarker, TextMarker]

const EDIT_SCOPE = 'MARKER_EDITING'
const SELECT_CIRCLE = '1'
const SELECT_SQUARE = '2'
const SELECT_FRAME = '3'
const SELECT_TEXT = '4'

const DEFAULT_MARK = {
  fillColor: '#EF4444',
  strokeColor: '#EF4444',
  strokeWidth: 3,
  strokeDasharray: '',
  opacity: 1,
  left: 183,
  top: 93,
  width: 40,
  height: 40,
  rotationAngle: 0,
  visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  containerTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  typeName: 'EllipseMarker',
} as any as RectangularBoxMarkerBaseState

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
      debug('in render')
      const newSrc = event.dataUrl
      setMarked(newSrc)
      onClose()
      await onChange(newSrc, serializeState(event.state))
    })

    areaRef.addEventListener('markercreate', (event) => {
      debug(event.marker?.getState())
    })
    areaRef.addEventListener('show', onOpen)
    areaRef.addEventListener('close', onClose)
  })

  function onOpen() {
    bindMarkerKeys()
    const cover = (areaRef as any).coverDiv as HTMLDivElement
    cover?.addEventListener('click', editClick)
    cover?.addEventListener('wheel', scrollMarkerColor)
  }

  function onClose() {
    setEditing(false)
    unbindMarkerKeys()
    // Quick mark in edit mode cleanup
    const cover = (areaRef as any).coverDiv as HTMLDivElement
    cover?.removeEventListener('click', editClick)
    cover?.removeEventListener('wheel', scrollMarkerColor)
  }

  function editClick(e: MouseEvent) {
    const isQuickMark = e.ctrlKey || e.metaKey

    if (!isQuickMark) return
    quickMark(e)
  }

  function handleEdit(e: MouseEvent) {
    debug('in edit')
    const isQuickMark = e.ctrlKey || e.metaKey

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
    const state = props.track.markerState
      ? deserializeState(props.track.markerState)
      : imageRef && createMarkerState(imageRef)
    if (!state) return

    const lastMarker: MarkerBaseState = last(state?.markers) ?? DEFAULT_MARK

    if (!isCenterable(lastMarker)) return

    const area = areaRef!

    const newMark = {
      ...lastMarker,
      top: getOrigin(e.offsetY, lastMarker.height),
      left: getOrigin(e.offsetX, lastMarker.width),
    }

    const newState = {
      ...state,
      markers: [...state.markers, newMark],
    } as MarkerAreaState

    area.renderState(newState)
  }

  const startMarker = (key: string, type: any) =>
    hotkeys(key, EDIT_SCOPE, () => {
      debug('you pressed', key)
      areaRef!.createNewMarker(type)
    })

  function bindMarkerKeys() {
    startMarker(SELECT_CIRCLE, EllipseMarker)
    startMarker(SELECT_SQUARE, CoverMarker)
    startMarker(SELECT_FRAME, FrameMarker)
    startMarker(SELECT_TEXT, TextMarker)
    hotkeys('ESC', EDIT_SCOPE, () => {
      // debug('area esc', areaRef?.currentMarker)

      if (areaRef?.currentMarker) {
        areaRef.switchToSelectMode()
      } else {
        areaRef?.close()
      }
      // areaRef?.close()
    })
    hotkeys('shift+a', EDIT_SCOPE, (_: KeyboardEvent) => {
      debug('debug', areaRef?.currentMarker)
      // scrollMarkerColor()
    })
    hotkeys.setScope(EDIT_SCOPE)
  }

  function unbindMarkerKeys() {
    debug('unbind')
    hotkeys.deleteScope(EDIT_SCOPE)
  }

  function scrollMarkerColor(e: WheelEvent) {
    if (!e.shiftKey) return
    if (!areaRef?.currentMarker || !('fillColor' in areaRef.currentMarker))
      return
    const currentMarkerColor = areaRef.currentMarker.fillColor
    const colors = (areaRef.currentMarker as any)?.fillPanel?.colors as string[]
    if (!colors?.length) return

    const colorPosition =
      colors.findIndex((c) => c === currentMarkerColor) ?? colors[0]
    const nextColor = colors.at(
      Math.sign(e.deltaY) ? colorPosition + 1 : colorPosition - 1,
    )

    ;(areaRef.currentMarker as any).setFillColor(nextColor)
    if ('strokeColor' in areaRef.currentMarker)
      (areaRef.currentMarker as any).setStrokeColor(nextColor)
  }

  const markerImage = () => (isEditing() ? props.track.image : markedSrc())

  return (
    <img
      class="image"
      ref={imageRef}
      src={markerImage()}
      alt={props.track.id}
      onClick={handleEdit}
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

function createMarkerState(img: HTMLImageElement): MarkerAreaState {
  return {
    width: img.width,
    height: img.height,
    markers: [],
  }
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

function debug(...args: any[]) {
  if (!window.location.hostname.includes('localhost')) return
  console.log(...args)
}
