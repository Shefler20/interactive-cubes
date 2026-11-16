export type CubeId = 'cube-1' | 'cube-2';

export type CubeColor = 'red' | 'blue' | 'green';

export type CubeColors = Record<CubeId, CubeColor>;

export type DragState = {
    cubeId: CubeId
    pointerId: number
    offsetX: number
    offsetY: number
  }

export type CubePosition = {
  x: number;
  y: number;
};

export type ColorOption = {
  color: CubeColor
  label: string
}

export type CubePositions = Record<CubeId, CubePosition>;

export type SnapSide = 'left' | 'right' | 'top' | 'bottom';

export type LinkedCube = {
  cubeId: CubeId
  position: CubePosition
}

export type CubeAttachment =
  | {
      stuck: false;
      side: null;
    }
  | {
      stuck: true;
      side: SnapSide;
    };
 
