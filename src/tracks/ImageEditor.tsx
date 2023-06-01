// import { useRef, useCallback, useEffect } from 'react'
import { type JSX, onMount } from 'solid-js'
import { MarkerArea, EllipseMarker, CoverMarker } from 'markerjs2'

export default function ImageEditor(props: {
  src: string
  alt: string
  onChange: (data: string) => void
  onOpen?: () => void
  onClose?: () => void
}): JSX.Element {
  let imageRef: HTMLImageElement | undefined
  let markerRef: MarkerArea | undefined

  onMount(() => {
    if (!imageRef || markerRef)
      throw new Error('ImageEditor did not mount correctly')

    markerRef = new MarkerArea(imageRef)
    markerRef.availableMarkerTypes = [EllipseMarker, CoverMarker]
    // deno-lint-ignore no-explicit-any
    markerRef.addEventListener('render', (event) => {
      props.onChange(event.dataUrl)
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (props.onOpen) markerRef.addEventListener('show', () => props.onOpen!())
    if (props.onClose)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      markerRef.addEventListener('close', () => props.onClose!())
  })

  return (
    <img
      class="image"
      ref={imageRef}
      src={props.src}
      alt={props.alt}
      onClick={() => markerRef?.show()}
    />
  )
}
