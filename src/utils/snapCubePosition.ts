import { SNAP_DISTANCE } from '../constants/cube.constants'
import type {
  CubeAttachment,
  CubeId,
  CubePosition,
  SnapSide,
} from '../types/cube.types'

type CubeSize = {
  width: number
  height: number
}

type FieldSize = {
  width: number
  height: number
}

export type SnapCubeResult = {
  position: CubePosition
  attachment: CubeAttachment
}

type SnapCandidate = {
  side: SnapSide
  position: CubePosition
  distance: number
}

const DETACHED: CubeAttachment = {
  stuck: false,
  side: null,
}

const getEdgeSeparation = (startA: number, startB: number, size: number) =>
  Math.max(startA, startB) - Math.min(startA + size, startB + size)

const oppositeSide = (side: SnapSide): SnapSide => {
  switch (side) {
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
  }
}

const sideOfCube2 = (draggedCubeId: CubeId, sideOfDraggedCube: SnapSide): SnapSide =>
  draggedCubeId === 'cube-2' ? sideOfDraggedCube : oppositeSide(sideOfDraggedCube)

const fitsField = (position: CubePosition, cubeSize: CubeSize, fieldSize: FieldSize) => {
  const maxX = Math.max(0, fieldSize.width - cubeSize.width)
  const maxY = Math.max(0, fieldSize.height - cubeSize.height)

  return position.x >= 0 && position.x <= maxX && position.y >= 0 && position.y <= maxY
}

const getTouchPosition = (
  side: SnapSide,
  moving: CubePosition,
  other: CubePosition,
  cubeSize: CubeSize,
): CubePosition => {
  switch (side) {
    case 'left':
      return { x: other.x - cubeSize.width, y: moving.y }
    case 'right':
      return { x: other.x + cubeSize.width, y: moving.y }
    case 'top':
      return { x: moving.x, y: other.y - cubeSize.height }
    case 'bottom':
      return { x: moving.x, y: other.y + cubeSize.height }
  }
}

const createCandidate = (
  side: SnapSide,
  moving: CubePosition,
  other: CubePosition,
  cubeSize: CubeSize,
  fieldSize: FieldSize,
  separation: number,
): SnapCandidate | null => {
  if (separation > SNAP_DISTANCE || !Number.isFinite(separation)) {
    return null
  }

  const position = getTouchPosition(side, moving, other, cubeSize)

  if (!fitsField(position, cubeSize, fieldSize)) {
    return null
  }

  const distance =
    side === 'left' || side === 'right'
      ? Math.abs(position.x - moving.x)
      : Math.abs(position.y - moving.y)

  return { side, position, distance }
}

const addAxisCandidate = (
  candidates: SnapCandidate[],
  moving: CubePosition,
  other: CubePosition,
  cubeSize: CubeSize,
  fieldSize: FieldSize,
  separation: number,
  perpendicularOverlaps: boolean,
  preferredSide: SnapSide,
) => {
  if (!perpendicularOverlaps) {
    return
  }

  const preferred = createCandidate(
    preferredSide,
    moving,
    other,
    cubeSize,
    fieldSize,
    separation,
  )

  if (preferred) {
    candidates.push(preferred)
    return
  }

  if (separation >= 0) {
    return
  }

  const alternate = createCandidate(
    oppositeSide(preferredSide),
    moving,
    other,
    cubeSize,
    fieldSize,
    separation,
  )

  if (alternate) {
    candidates.push(alternate)
  }
}

export const snapCubePosition = (
  moving: CubePosition,
  other: CubePosition,
  draggedCubeId: CubeId,
  cubeSize: CubeSize,
  fieldSize: FieldSize,
): SnapCubeResult => {
  const separationX = getEdgeSeparation(moving.x, other.x, cubeSize.width)
  const separationY = getEdgeSeparation(moving.y, other.y, cubeSize.height)
  const candidates: SnapCandidate[] = []

  addAxisCandidate(
    candidates,
    moving,
    other,
    cubeSize,
    fieldSize,
    separationX,
    separationY < 0,
    moving.x + cubeSize.width / 2 <= other.x + cubeSize.width / 2 ? 'left' : 'right',
  )

  addAxisCandidate(
    candidates,
    moving,
    other,
    cubeSize,
    fieldSize,
    separationY,
    separationX < 0,
    moving.y + cubeSize.height / 2 <= other.y + cubeSize.height / 2 ? 'top' : 'bottom',
  )

  const closest = candidates.reduce<SnapCandidate | null>((best, candidate) => {
    if (best === null || candidate.distance < best.distance) {
      return candidate
    }

    return best
  }, null)

  if (closest === null) {
    return {
      position: moving,
      attachment: DETACHED,
    }
  }

  return {
    position: closest.position,
    attachment: {
      stuck: true,
      side: sideOfCube2(draggedCubeId, closest.side),
    },
  }
}
