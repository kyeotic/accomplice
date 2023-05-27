import { useRef, useCallback } from 'react'
import { MarkerArea } from 'markerjs2'

export default function ImageEditor({
  src,
  alt,
  onChange,
}: {
  src: string
  alt: string
  onChange: (data: string) => void
}): JSX.Element {
  const markerRef = useRef(null)

  const showMarker = useCallback(() => {
    console.log('maark')
    if (markerRef.current === null) return
    const marker = new MarkerArea(markerRef.current)

    marker.addEventListener('render', (event: any) => {
      onChange(event.dataUrl)
    })

    marker.show()
  }, [])

  return <img ref={markerRef} src={src} alt={alt} onClick={showMarker} />
}
