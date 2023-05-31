import { useRef, useCallback, useEffect } from 'react'
import { MarkerArea, EllipseMarker, CoverMarker } from 'markerjs2'

export default function ImageEditor({
  src,
  alt,
  onChange,
  onOpen,
  onClose,
}: {
  src: string
  alt: string
  onChange: (data: string) => void
  onOpen?: () => void
  onClose?: () => void
}): JSX.Element {
  const imageRef = useRef(null)
  const markerRef = useRef<MarkerArea | null>(null)

  useEffect(() => {
    // console.log('image ref loaded', imageRef)
    if (!imageRef.current || markerRef.current) return

    const marker = new MarkerArea(imageRef.current)
    marker.availableMarkerTypes = [EllipseMarker, CoverMarker]
    // deno-lint-ignore no-explicit-any
    marker.addEventListener('render', (event: any) => {
      onChange(event.dataUrl)
    })
    if (onOpen) marker.addEventListener('show', () => onOpen())
    if (onClose) marker.addEventListener('close', () => onClose())

    markerRef.current = marker

    return () => {
      markerRef.current = null
    }
  }, [])

  const showMarker = useCallback(() => {
    markerRef.current?.show()
  }, [])

  return (
    <img
      className="image"
      ref={imageRef}
      src={src}
      alt={alt}
      onClick={showMarker}
    />
  )
}
