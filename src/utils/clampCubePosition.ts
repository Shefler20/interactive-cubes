import type { CubePosition } from '../types/cube.types'

export const clampCubePosition = (
  position: CubePosition,
  fieldElement: HTMLElement,
  cubeElement: HTMLElement,
): CubePosition => {
  const maxX = Math.max(0, fieldElement.clientWidth - cubeElement.offsetWidth)
  const maxY = Math.max(0, fieldElement.clientHeight - cubeElement.offsetHeight)

  return {
    x: Math.min(Math.max(position.x, 0), maxX),
    y: Math.min(Math.max(position.y, 0), maxY),
  }
}
