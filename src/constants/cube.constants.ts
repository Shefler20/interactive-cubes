import type { CubeId, ColorOption, CubeAttachment } from "../types/cube.types";

export const CUBE_IDS: CubeId[] = ['cube-1', 'cube-2'];

export const SNAP_DISTANCE = 20;

export const SCATTER_DISTANCE_MIN = 80;

export const SCATTER_DISTANCE_MAX = 150;

export const SCATTER_MIN_GAP = 10;

export const SCATTER_ATTEMPT_LIMIT = 100;

export const COLOR_OPTIONS: ColorOption[] = [
    { color: 'red', label: 'Красный' },
    { color: 'blue', label: 'Синий' },
    { color: 'green', label: 'Зелёный' },
  ];

export const DETACHED_CUBES: CubeAttachment = {
    stuck: false,
    side: null,
  }