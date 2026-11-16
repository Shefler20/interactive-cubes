import type { CubeId } from '../types/cube.types'

export const getOtherCubeId = (cubeId: CubeId): CubeId => cubeId === 'cube-1' ? 'cube-2' : 'cube-1';
