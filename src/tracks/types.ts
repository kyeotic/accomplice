export interface Track {
  id: string
  group: string
  image: string
  marks: Mark[]
}

export interface Mark {
  id: string
  type: MarkType
  position: Point
  width: number
  height: number
}

export enum MarkType {
  Chech = 'check',
  Cross = 'cross',
}

export interface Point {
  x: number
  y: number
}
