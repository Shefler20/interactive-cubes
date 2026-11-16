import { SCATTER_ATTEMPT_LIMIT, SCATTER_MIN_GAP } from '../constants/cube.constants'
import type { CubeId, CubePosition, CubePositions } from '../types/cube.types'
import { getRandomScatterOffset } from './getRandomScatterOffset'

type CubeSize = {
  width: number
  height: number
}

type FieldSize = {
  width: number
  height: number
}

type CubeRect = CubePosition & CubeSize

type CubeSizes = Record<CubeId, CubeSize>

type ClampPosition = (position: CubePosition, cubeId: CubeId) => CubePosition

const toRect = (position: CubePosition, size: CubeSize): CubeRect => ({
  x: position.x,
  y: position.y,
  width: size.width,
  height: size.height,
})

const rectanglesIntersect = (first: CubeRect, second: CubeRect) =>
  first.x < second.x + second.width &&
  first.x + first.width > second.x &&
  first.y < second.y + second.height &&
  first.y + first.height > second.y

const getAxisGap = (startA: number, sizeA: number, startB: number, sizeB: number) =>
  Math.max(startB - (startA + sizeA), startA - (startB + sizeB))

const getRectangleDistance = (first: CubeRect, second: CubeRect) => {
  const gapX = getAxisGap(first.x, first.width, second.x, second.width)
  const gapY = getAxisGap(first.y, first.height, second.y, second.height)

  if (gapX < 0 && gapY < 0) {
    return Math.max(gapX, gapY)
  }

  if (gapX < 0) {
    return gapY
  }

  if (gapY < 0) {
    return gapX
  }

  return Math.hypot(gapX, gapY)
}

const getPlacementDistance = (positions: CubePositions, sizes: CubeSizes) =>
  getRectangleDistance(
    toRect(positions['cube-1'], sizes['cube-1']),
    toRect(positions['cube-2'], sizes['cube-2']),
  )

const cubesAreSeparated = (positions: CubePositions, sizes: CubeSizes) => {
  const first = toRect(positions['cube-1'], sizes['cube-1'])
  const second = toRect(positions['cube-2'], sizes['cube-2'])

  return !rectanglesIntersect(first, second) && getRectangleDistance(first, second) >= SCATTER_MIN_GAP
}

const scatterPositions = (positions: CubePositions, clampPosition: ClampPosition): CubePositions => {
  const cube1Offset = getRandomScatterOffset()
  const cube2Offset = getRandomScatterOffset()

  return {
    'cube-1': clampPosition(
      {
        x: positions['cube-1'].x + cube1Offset.x,
        y: positions['cube-1'].y + cube1Offset.y,
      },
      'cube-1',
    ),
    'cube-2': clampPosition(
      {
        x: positions['cube-2'].x + cube2Offset.x,
        y: positions['cube-2'].y + cube2Offset.y,
      },
      'cube-2',
    ),
  }
}

const getFallbackPositions = (
  sizes: CubeSizes,
  fieldSize: FieldSize,
  clampPosition: ClampPosition,
): CubePositions => {
  const placements: CubePositions[] = [
    {
      'cube-1': clampPosition({ x: 0, y: 0 }, 'cube-1'),
      'cube-2': clampPosition(
        { x: sizes['cube-1'].width + SCATTER_MIN_GAP, y: 0 },
        'cube-2',
      ),
    },
    {
      'cube-1': clampPosition({ x: 0, y: 0 }, 'cube-1'),
      'cube-2': clampPosition(
        { x: 0, y: sizes['cube-1'].height + SCATTER_MIN_GAP },
        'cube-2',
      ),
    },
    {
      'cube-1': clampPosition({ x: 0, y: 0 }, 'cube-1'),
      'cube-2': clampPosition({ x: fieldSize.width, y: fieldSize.height }, 'cube-2'),
    },
  ]

  const separated = placements.find((placement) => cubesAreSeparated(placement, sizes))

  if (separated !== undefined) {
    return separated
  }

  return placements.reduce((best, placement) =>
    getPlacementDistance(placement, sizes) > getPlacementDistance(best, sizes) ? placement : best,
  )
}

export const findDetachedCubePositions = (
  positions: CubePositions,
  sizes: CubeSizes,
  fieldSize: FieldSize,
  clampPosition: ClampPosition,
): CubePositions => {
  for (let attempt = 0; attempt < SCATTER_ATTEMPT_LIMIT; attempt += 1) {
    const nextPositions = scatterPositions(positions, clampPosition)

    if (cubesAreSeparated(nextPositions, sizes)) {
      return nextPositions
    }
  }

  return getFallbackPositions(sizes, fieldSize, clampPosition)
}
