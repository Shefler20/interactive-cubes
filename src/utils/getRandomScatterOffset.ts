import { SCATTER_DISTANCE_MAX, SCATTER_DISTANCE_MIN } from '../constants/cube.constants'
import type { CubePosition } from '../types/cube.types'

export const getRandomScatterOffset = (): CubePosition => {
  const angle = Math.random() * Math.PI * 2
  const distance =
    SCATTER_DISTANCE_MIN + Math.random() * (SCATTER_DISTANCE_MAX - SCATTER_DISTANCE_MIN)

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}
