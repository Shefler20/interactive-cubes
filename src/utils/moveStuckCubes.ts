import type { CubeId, CubePosition, CubePositions } from '../types/cube.types'

type CubeSize = {
  width: number
  height: number
}

type FieldSize = {
  width: number
  height: number
}

const clampSharedDelta = (delta: number, starts: number[], limits: number[]) => {
  const minDelta = starts.reduce((limit, start) => Math.max(limit, -start), Number.NEGATIVE_INFINITY)
  const maxDelta = starts.reduce(
    (limit, start, index) => Math.min(limit, limits[index] - start),
    Number.POSITIVE_INFINITY,
  )

  if (minDelta > maxDelta) {
    return 0
  }

  return Math.min(Math.max(delta, minDelta), maxDelta)
}

const axisLimit = (fieldLength: number, cubeLength: number) =>
  Math.max(0, fieldLength - cubeLength)

export const moveStuckCubes = (
  desiredPosition: CubePosition,
  positions: CubePositions,
  draggedCubeId: CubeId,
  draggedSize: CubeSize,
  otherSize: CubeSize,
  fieldSize: FieldSize,
): CubePositions => {
  const dragged = positions[draggedCubeId]
  const sizes: Record<CubeId, CubeSize> =
    draggedCubeId === 'cube-1'
      ? { 'cube-1': draggedSize, 'cube-2': otherSize }
      : { 'cube-1': otherSize, 'cube-2': draggedSize }
  const deltaX = clampSharedDelta(
    desiredPosition.x - dragged.x,
    [positions['cube-1'].x, positions['cube-2'].x],
    [
      axisLimit(fieldSize.width, sizes['cube-1'].width),
      axisLimit(fieldSize.width, sizes['cube-2'].width),
    ],
  )
  const deltaY = clampSharedDelta(
    desiredPosition.y - dragged.y,
    [positions['cube-1'].y, positions['cube-2'].y],
    [
      axisLimit(fieldSize.height, sizes['cube-1'].height),
      axisLimit(fieldSize.height, sizes['cube-2'].height),
    ],
  )

  return {
    'cube-1': {
      x: positions['cube-1'].x + deltaX,
      y: positions['cube-1'].y + deltaY,
    },
    'cube-2': {
      x: positions['cube-2'].x + deltaX,
      y: positions['cube-2'].y + deltaY,
    },
  }
}
