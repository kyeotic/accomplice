export interface Track {
  id: string
  group: string
  position: number
  image: string
  markerImage?: string
  markerState?: string
}

export interface Group {
  id: string
  name: string
  createdAt: number
}
